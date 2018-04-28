import * as express from "express";
import IPermission from "../models/IPermission";

import Controller from "./Controller";
import PermissionDao from "../dao/PermissionDao";
import JwtMiddleware from "../middleware/JWTMiddleware";
import MessageFactory from "../Utils/MessageFactory";

export default class PermissionController extends Controller {
  constructor(private permissionDao: PermissionDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const result: IPermission[] = await this.permissionDao.findAll();
          return res.json(result);
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    // Return permissions of the logged in user.
    this.router.get(
      "/user",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        const permissions: number = res.locals.token.data.permissions;
        return res.status(200).json({ permissions });
      }
    );

    this.router.get(
      "/:permissionId(\\d+)",
      JwtMiddleware,
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
          console.error(ex);
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    this.router.post(
      "",
      JwtMiddleware,
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
          console.error(err);
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    return this.router;
  }
}
