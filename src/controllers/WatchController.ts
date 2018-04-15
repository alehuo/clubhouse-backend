import * as express from "express";
import * as bcrypt from "bcrypt";
import Controller from "./Controller";
import { JwtMiddleware } from "../JwtUtils";
import WatchDao from "../dao/WatchDao";
import { PermissionMiddleware } from "../PermissionMiddleware";
import { getPermission, permissionNames } from "../PermissionUtils";
import IWatch from "../models/IWatch";

export default class WatchController extends Controller {
  constructor(private watchDao: WatchDao) {
    super();
  }

  public routes(): express.Router {
    // All watches that are currently running
    this.router.get(
      "/ongoing",
      async (req: express.Request, res: express.Response) => {
        try {
          const watches: IWatch[] = await this.watchDao.findAllOngoing();
          return res.status(200).json(watches);
        } catch (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );
    // All watches from a single user that are currently running
    this.router.get(
      "/ongoing/user/:userId",
      async (req: express.Request, res: express.Response) => {
        try {
          const watches: IWatch[] = await this.watchDao.findOngoingByUser(
            req.params.userId
          );
          return res.status(200).json(watches);
        } catch (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );
    // Start a watch.
    this.router.post(
      "/start",
      async (req: express.Request, res: express.Response) => {
        return res.status(200).json({ message: "Start a watch" });
      }
    );
    // End a watch.
    this.router.post(
      "/end",
      async (req: express.Request, res: express.Response) => {
        return res.status(200).json({ message: "End a watch" });
      }
    );
    return this.router;
  }
}
