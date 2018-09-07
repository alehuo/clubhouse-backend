import * as express from "express";
import WatchDao from "../dao/WatchDao";
import Controller from "./Controller";

import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { IWatch } from "../models/IWatch";
import { MessageFactory } from "../utils/MessageFactory";

import UserDao from "../dao/UserDao";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { IUser } from "../models/IUser";
import { watchFilter } from "../models/IWatch";
import { sendEmail } from "../utils/Mailer";

export default class WatchController extends Controller {
  constructor(private watchDao: WatchDao, private userDao: UserDao) {
    super();
  }

  public routes(): express.Router {
    // All watches that are currently running
    this.router.get(
      "/ongoing",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const watches: IWatch[] = await this.watchDao.findAllOngoing();
          return res.status(200).json(watches.map(watchFilter));
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get ongoing watches",
                err as Error
              )
            );
        }
      }
    );
    // All watches from a single user
    this.router.get(
      "/user/:userId(\\d+)",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const watches: IWatch[] = await this.watchDao.findByUser(
            req.params.userId
          );
          return res.status(200).json(watches.map(watchFilter));
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get sessions from a single user",
                err as Error
              )
            );
        }
      }
    );
    // All watches from a single user that are currently running
    this.router.get(
      "/ongoing/user/:userId(\\d+)",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const watches: IWatch[] = await this.watchDao.findOngoingByUser(
            req.params.userId
          );
          return res.status(200).json(watches.map(watchFilter));
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error:" +
                  " Cannot get current running sessions from a single user",
                err as Error
              )
            );
        }
      }
    );
    // Start a watch.
    this.router.post(
      "/start",
      RequestParamMiddleware("startMessage"),
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const userId: number = res.locals.token.data.userId;
          const watches: IWatch[] = await this.watchDao.findOngoingByUser(
            userId
          );
          if (watches && watches.length > 0) {
            return res
              .status(400)
              .json(
                MessageFactory.createError("You already have an ongoing session running.")
              );
          }
          const watch: IWatch = {
            userId,
            startMessage: req.body.startMessage,
            startTime: new Date()
          };

          const user: IUser = await this.userDao.findOne(userId);

          // TODO: Websocket integration

          await this.watchDao.save(watch);

          const title: string =
            (process.env.MAIL_PREFIX
              ? "[" + process.env.MAIL_PREFIX + "]: "
              : "") +
            user.firstName +
            " " +
            user.lastName +
            " has started a new session";

          const message: string =
            user.firstName +
            " " +
            user.lastName +
            " has started a new session with the following message: \r\n\r\n\r\n\r\n" +
            watch.startMessage +
            "\r\n\r\n\r\n\r\nTo view more details, please visit the clubhouse website.";

          const htmlMessage: string =
            "<span style='font-weight: bold;'>" +
            user.firstName +
            " " +
            user.lastName +
            "</span> has started a new session with the following message: <br/><br/><br/><p>" +
            watch.startMessage +
            "</p>" +
            "<br/><br/><br/><br/><hr/>To view more details, please visit the clubhouse website.";

          // TODO: Fetch email list from userDao
          await sendEmail(["testuser@test.com"], title, message, htmlMessage);

          return res
            .status(201)
            .json(MessageFactory.createMessage("Session started"));
        } catch (err) {
          console.log(err);
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot start a session",
                err as Error
              )
            );
        }
      }
    );
    // Stop a watch.
    this.router.post(
      "/stop",
      RequestParamMiddleware("endMessage"),
      JWTMiddleware,
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
                  MessageFactory.createError("You don't have an ongoing session.")
                );
            } else if (watches.length > 1) {
              return res
                .status(400)
                .json(
                  MessageFactory.createError(
                    "You have more than one session running." +
                      "Please contact a system administrator and use the email system as a backup."
                  )
                );
            }
          }
          const currentWatch: IWatch = watches[0];
          const watch: IWatch = {
            userId,
            endMessage: req.body.endMessage,
            endTime: new Date(),
            ended: true
          };
          if (!currentWatch.watchId) {
            return res
              .status(400)
              .json(MessageFactory.createError("Invalid session id"));
          }

          await this.watchDao.endWatch(currentWatch.watchId, watch);

          const user: IUser = await this.userDao.findOne(userId);

          // TODO: Websocket integration

          const title: string =
            (process.env.MAIL_PREFIX
              ? "[" + process.env.MAIL_PREFIX + "]: "
              : "") +
            user.firstName +
            " " +
            user.lastName +
            " has ended a session";

          const message: string =
            user.firstName +
            " " +
            user.lastName +
            " has ended a session with the following message: \r\n\r\n\r\n\r\n" +
            watch.endMessage +
            "\r\n\r\n\r\n\r\nTo view more details, please visit the clubhouse website.";

          const htmlMessage: string =
            "<span style='font-weight: bold;'>" +
            user.firstName +
            " " +
            user.lastName +
            "</span> has ended a session with the following message: <br/><br/><br/><p>" +
            watch.endMessage +
            "</p>" +
            "<br/><br/><br/><br/><hr/>To view more details, please visit the clubhouse website.";

          // TODO: Fetch email list from userDao
          await sendEmail(["testuser@test.com"], title, message, htmlMessage);

          return res
            .status(200)
            .json(
              MessageFactory.createMessage(
                "Session ended with message '" + req.body.endMessage + "'"
              )
            );
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Can't end a session",
                err as Error
              )
            );
        }
      }
    );
    this.router.get(
      "/ownstatus",
      JWTMiddleware,
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
              MessageFactory.createError("Internal server error", err as Error)
            );
        }
      }
    );
    return this.router;
  }
}
