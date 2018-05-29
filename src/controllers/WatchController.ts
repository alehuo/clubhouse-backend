import * as express from "express";
import * as bcrypt from "bcrypt";
import Controller from "./Controller";
import WatchDao from "../dao/WatchDao";

import IWatch from "../models/IWatch";
import JwtMiddleware from "../middleware/JWTMiddleware";
import MessageFactory from "../Utils/MessageFactory";

import { watchFilter } from "./../models/IWatch";

export default class WatchController extends Controller {
  constructor(private watchDao: WatchDao) {
    super();
  }

  public routes(): express.Router {
    // All watches that are currently running
    this.router.get(
      "/ongoing",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const watches: IWatch[] = await this.watchDao.findAllOngoing();
          return res.status(200).json(watches.map(watchFilter));
        } catch (err) {
          return res.status(500).json({
            error: "Internal server error: Cannot get ongoing watches"
          });
        }
      }
    );
    // All watches from a single user
    this.router.get(
      "/user/:userId(\\d+)",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const watches: IWatch[] = await this.watchDao.findByUser(
            req.params.userId
          );
          return res.status(200).json(watches.map(watchFilter));
        } catch (err) {
          return res.status(500).json({
            error:
              "Internal server error: Cannot get watches from a single user"
          });
        }
      }
    );
    // All watches from a single user that are currently running
    this.router.get(
      "/ongoing/user/:userId(\\d+)",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const watches: IWatch[] = await this.watchDao.findOngoingByUser(
            req.params.userId
          );
          return res.status(200).json(watches.map(watchFilter));
        } catch (err) {
          return res.status(500).json({
            error:
              "Internal server error:" +
              " Cannot get current running watches from a single user"
          });
        }
      }
    );
    // Start a watch.
    this.router.post(
      "/start",
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
              .json(
                MessageFactory.createError("You already have an ongoing watch")
              );
          }
          if (req.body.startMessage) {
            const watch: IWatch = {
              userId,
              startMessage: req.body.startMessage,
              startTime: new Date()
            };
            const savedWatch: number[] = await this.watchDao.save(watch);
            return res
              .status(201)
              .json(MessageFactory.createMessage("Watch started"));
          } else {
            return res
              .status(400)
              .json(MessageFactory.createError("Missing starting message"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot start a watch"
              )
            );
        }
      }
    );
    // Stop a watch.
    this.router.post(
      "/stop",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const userId: number = res.locals.token.data.userId;
          const watches: IWatch[] = await this.watchDao.findOngoingByUser(
            userId
          );
          if (watches) {
            if (watches.length === 0) {
              return res
                .status(400)
                .json(
                  MessageFactory.createError("You don't have an ongoing watch.")
                );
            } else if (watches.length > 1) {
              return res
                .status(400)
                .json(
                  MessageFactory.createError(
                    "You have more than one watch running." +
                      "Please contact a system administrator and use the email system as a backup."
                  )
                );
            }
          }
          if (req.body.endMessage) {
            const currentWatch = watches[0];
            const watch: IWatch = {
              userId,
              endMessage: req.body.endMessage,
              endTime: new Date(),
              ended: true
            };
            if (!currentWatch.watchId) {
              return res
                .status(400)
                .json(MessageFactory.createError("Invalid watch id"));
            }
            const endedWatch = await this.watchDao.endWatch(
              currentWatch.watchId,
              watch
            );
            return res
              .status(200)
              .json(
                MessageFactory.createMessage(
                  "Watch ended with message '" + req.body.endMessage + "'"
                )
              );
          } else {
            return res
              .status(400)
              .json(MessageFactory.createError("Missing ending message"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Can't end a watch"
              )
            );
        }
      }
    );
    this.router.get(
      "/ownstatus",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const userId: number = res.locals.token.data.userId;
          const watches: IWatch[] = await this.watchDao.findOngoingByUser(
            userId
          );
          const otherWatches: IWatch[] = await this.watchDao.findAllOngoing();
          const peopleCount: number = otherWatches.filter(
            (watch: IWatch) => watch.userId !== userId
          ).length;
          return res
            .status(200)
            .json({ running: watches && watches.length !== 0, peopleCount });
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Can't return if current user has a watch running"
              )
            );
        }
      }
    );
    return this.router;
  }
}
