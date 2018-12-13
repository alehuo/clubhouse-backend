import express from "express";

import PermissionDao from "../dao/PermissionDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import Controller from "./Controller";

import { Permission, Permissions } from "@alehuo/clubhouse-shared";
import { isNumber, isPermission } from "@alehuo/clubhouse-shared/dist/Models";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { getPermissions } from "../utils/PermissionUtils";

export default class PermissionController extends Controller {
  constructor(private permissionDao: PermissionDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_VIEW_PERMISSIONS),
      async (req: express.Request, res: express.Response) => {
        try {
          const result = await this.permissionDao.findAll();
          return res.json(result);
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get permissions",
                err as Error
              )
            );
        }
      }
    );

    // Return permissions of the logged in user.
    this.router.get(
      "/user",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        const permissions: number = res.locals.token.data.permissions;
        const permlist = await getPermissions(permissions);
        return res.status(200).json({
          permissions,
          permission_list: permlist.map((permission) => {
            delete permission.created_at;
            delete permission.updated_at;
            delete permission.permissionId;
            return permission;
          })
        });
      }
    );

    this.router.get(
      "/:permissionId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_VIEW_PERMISSIONS),
      async (req: express.Request, res: express.Response) => {
        if (!isNumber(req.params.permissionId)) {
          return res
            .status(400)
            .json(MessageFactory.createError("Invalid permission ID"));
        }
        try {
          const permission = await this.permissionDao.findOne(
            req.params.permissionId
          );
          if (!permission) {
            return res
              .status(404)
              .json(MessageFactory.createError("Permission not found"));
          } else {
            return res.status(200).json(permission);
          }
        } catch (ex) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get single permission",
                ex as Error
              )
            );
        }
      }
    );

    this.router.post(
      "",
      RequestParamMiddleware("name", "value"),
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_ADD_EDIT_REMOVE_PERMISSIONS),
      async (req: express.Request, res: express.Response) => {
        try {
          const { name, value }: Permission = req.body;
          const perm = await this.permissionDao.findByValue(value);

          if (perm) {
            return res
              .status(400)
              .json(MessageFactory.createError("Permission already exists"));
          } else {
            const dbPerm: Permission = {
              name,
              value,
              created_at: "",
              updated_at: "",
              permissionId: -1
            };

            if (!isPermission(dbPerm)) {
              return res
                .status(400)
                .json(
                  MessageFactory.createError(
                    "The request did not contain a valid permission object."
                  )
                );
            }

            const savedPermission = await this.permissionDao.save(dbPerm);

            return res.status(201).json({
              ...{ name, value },
              ...{
                permissionId: savedPermission[0]
              }
            });
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot add new permission",
                err as Error
              )
            );
        }
      }
    );

    return this.router;
  }
}
