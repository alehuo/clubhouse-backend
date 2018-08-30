import * as express from "express";
import { IPermission } from "../models/IPermission";

import PermissionDao from "../dao/PermissionDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import Controller from "./Controller";

import { getPermissions } from "../utils/PermissionUtils";

export default class PermissionController extends Controller {
  constructor(private permissionDao: PermissionDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const result: IPermission[] = await this.permissionDao.findAll();
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
        const permlist: IPermission[] = await getPermissions(permissions);
        return res.status(200).json({
          permissions,
          permission_list: permlist.map((permission: IPermission) => {
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
      async (req: express.Request, res: express.Response) => {
        try {
          const permission: IPermission = await this.permissionDao.findOne(
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
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const permissionData: IPermission = req.body;
          if (!(permissionData.name && permissionData.value)) {
            return res
              .status(500)
              .json(
                MessageFactory.createError("Missing request body parameters")
              );
          } else {
            const perm: IPermission = await this.permissionDao.findByValue(
              permissionData.value
            );

            if (perm) {
              return res
                .status(400)
                .json(MessageFactory.createError("Permission already exists"));
            } else {
              const savedPermission: number[] = await this.permissionDao.save({
                name: permissionData.name,
                value: permissionData.value
              });

              return res.status(201).json(
                Object.assign({}, permissionData, {
                  permissionId: savedPermission[0]
                })
              );
            }
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
