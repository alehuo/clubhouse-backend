import express from "express";

import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import Controller from "./Controller";

import { Permission } from "@alehuo/clubhouse-shared";
import { logger } from "../index";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { getPermissions } from "../utils/PermissionUtils";
import { StatusCode } from "../utils/StatusCodes";

export default class PermissionController extends Controller {
  constructor() {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_VIEW_PERMISSIONS),
      async (req, res) => {
        try {
          return res.json(
            MessageFactory.createResponse<typeof Permission>(
              true,
              "",
              Permission
            )
          );
        } catch (err) {
          logger.error(err);
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
    this.router.get("/user", JWTMiddleware, async (req, res) => {
      const permissions: number = res.locals.token.data.permissions;
      const permlist = getPermissions(permissions);
      return res.status(StatusCode.OK).json(
        MessageFactory.createResponse(true, "", {
          permissions,
          permission_list: permlist
        })
      );
    });
    /*
    this.router.get(
      "/:permissionId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_VIEW_PERMISSIONS),
      async (req, res) => {
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
      */
    /*
    this.router.post(
      "",
      RequestParamMiddleware("name", "value"),
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_ADD_EDIT_REMOVE_PERMISSIONS),
      async (req, res) => {
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
      */
    return this.router;
  }
}
