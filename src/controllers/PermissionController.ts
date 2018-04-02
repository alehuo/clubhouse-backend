import * as express from "express";
import IPermission from "../models/IPermission";

import Controller from "./Controller";
import PermissionDao from "../dao/PermissionDao";
import { JwtMiddleware } from "../JwtUtils";

export default class PermissionController extends Controller {
  constructor(private permissionDao: PermissionDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", async (req: express.Request, res: express.Response) => {
      try {
        const result: IPermission[] = await this.permissionDao.findAll();
        return res.json(result);
      } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    this.router.get(
      "/:permissionId",
      async (req: express.Request, res: express.Response) => {
        try {
          const permissions: IPermission[] = await this.permissionDao.findOne(
            req.params.userId
          );
          if (!(permissions && permissions.length === 1)) {
            return res.status(404).json({ error: "Permission not found" });
          } else {
            return res.status(200).json(permissions[0]);
          }
        } catch (ex) {
          console.error(ex);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );

    this.router.post(
      "",
      async (req: express.Request, res: express.Response) => {
        try {
          const permissionData: IPermission = req.body;
          if (!(permissionData.name && permissionData.value)) {
            return res
              .status(500)
              .json({ error: "Missing request body parameters" });
          } else {
            const perm:
              | IPermission[]
              | undefined = await this.permissionDao.findByValue(
              permissionData.value
            );

            if (perm && perm.length > 0) {
              return res
                .status(400)
                .json({ error: "Permission already exists" });
            } else {
              const savedPermission = await this.permissionDao.save({
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
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );

    return this.router;
  }
}
