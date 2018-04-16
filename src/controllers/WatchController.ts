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
    // All watches from a single user
    this.router.get(
      "/user/:userId",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const watches: IWatch[] = await this.watchDao.findByUser(
            req.params.userId
          );
          return res.status(200).json(watches);
        } catch (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );
    // All watches from a single user that are currently running
    this.router.get(
      "/ongoing/user/:userId",
      JwtMiddleware,
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
    // Begin a watch.
    this.router.post(
      "/begin",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const userId = res.locals.token.data.userId;
          const watches: IWatch[] = await this.watchDao.findOngoingByUser(
            userId
          );
          if (watches && watches.length > 0) {
            return res
              .status(400)
              .json({ message: "You already have an ongoing watch." });
          }
          if (req.body.startMessage) {
            const watch: IWatch = {
              userId,
              startMessage: req.body.startMessage,
              startTime: new Date()
            };
            const savedWatch = await this.watchDao.save(watch);
            return res.status(200).json({ message: "Watch started" });
          } else {
            return res
              .status(400)
              .json({ message: "Missing starting message" });
          }
        } catch (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );
    // End a watch.
    this.router.post(
      "/end",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const userId = res.locals.token.data.userId;
          const watches: IWatch[] = await this.watchDao.findOngoingByUser(
            userId
          );
          if (watches) {
            if (watches.length === 0) {
              return res
                .status(400)
                .json({ message: "You don't have an ongoing watch." });
            } else if (watches.length > 1) {
              return res.status(400).json({
                message:
                  "You have more than one watch running. Please contact a system administrator and use the email system as a backup."
              });
            }
          }
          if (req.body.endMessage) {
            const currentWatch = watches[0];
            const watch: IWatch = {
              userId,
              endMessage: req.body.endMessage,
              endTime: new Date()
            };
            if (!currentWatch.watchId) {
              return res.status(400).json({ message: "Invalid watch ID" });
            }
            const endedWatch = await this.watchDao.endWatch(
              currentWatch.watchId,
              watch
            );
            return res.status(200).json({
              message: "Watch ended with message '" + req.body.endMessage + "'"
            });
          } else {
            return res.status(400).json({ message: "Missing ending message" });
          }
        } catch (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );
    return this.router;
  }
}
