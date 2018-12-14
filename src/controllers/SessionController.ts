import express from "express";
import SessionDao from "../dao/SessionDao";
import Controller from "./Controller";

import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";

import { Session } from "@alehuo/clubhouse-shared";
import { isSession } from "@alehuo/clubhouse-shared/dist/Models";
import moment from "moment";
import { isString } from "util";
import UserDao from "../dao/UserDao";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { sessionFilter } from "../models/ISession";
import { sendEmail } from "../utils/Mailer";
import { MessageType, WebSocketServer, WsMessage } from "../WebSocket";

export default class SessionController extends Controller {
  constructor(
    private sessionDao: SessionDao,
    private userDao: UserDao,
    private ws: WebSocketServer
  ) {
    super();
  }

  public routes(): express.Router {
    // All session that are currently running
    this.router.get(
      "/ongoing",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const sessions = await this.sessionDao.findAllOngoing();
          return res
            .status(200)
            .json(
              MessageFactory.createResponse<Session[]>(
                true,
                "",
                sessions.map(sessionFilter)
              )
            );
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get ongoing sessions",
                err as Error
              )
            );
        }
      }
    );
    // All sessions from a single user
    this.router.get(
      "/user/:userId(\\d+)",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const sessions = await this.sessionDao.findByUser(req.params.userId);
          return res
            .status(200)
            .json(
              MessageFactory.createResponse<Session[]>(
                true,
                "",
                sessions.map(sessionFilter)
              )
            );
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Server error: Cannot get sessions from a single user",
                err as Error
              )
            );
        }
      }
    );
    // All sessions from a single user that are currently running
    this.router.get(
      "/ongoing/user/:userId(\\d+)",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const sessions = await this.sessionDao.findOngoingByUser(
            req.params.userId
          );
          return res
            .status(200)
            .json(
              MessageFactory.createResponse<Session[]>(
                true,
                "",
                sessions.map(sessionFilter)
              )
            );
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Server error:" +
                  " Cannot get current running sessions from a single user",
                err as Error
              )
            );
        }
      }
    );
    // Start a session.
    this.router.post(
      "/start",
      RequestParamMiddleware("startMessage"),
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        const { startMessage }: { startMessage: string } = req.body;

        if (!isString(startMessage)) {
          return res.status(400).json("Invalid format for start message.");
        }

        try {
          const userId: number = res.locals.token.data.userId;
          const sessions = await this.sessionDao.findOngoingByUser(userId);
          if (sessions && sessions.length > 0) {
            return res
              .status(400)
              .json(
                MessageFactory.createError(
                  "You already have an ongoing session running."
                )
              );
          }
          const session: Session = {
            sessionId: -1, // Placeholder
            userId,
            startMessage,
            endMessage: "",
            startTime: moment().toISOString(),
            endTime: "",
            ended: 0,
            started: 1,
            created_at: "placeholder", // Placeholder
            updated_at: "placeholder" // Placeholder
          };

          if (!isSession(session)) {
            return res
              .status(400)
              .json(
                MessageFactory.createError(
                  "The request did not contain a valid session object."
                )
              );
          }

          const user = await this.userDao.findOne(userId);

          await this.sessionDao.save(session);

          const title =
            (process.env.MAIL_PREFIX
              ? "[" + process.env.MAIL_PREFIX + "]: "
              : "") +
            user.firstName +
            " " +
            user.lastName +
            " has started a new session";

          const message =
            user.firstName +
            " " +
            user.lastName +
            " has started a new session with the following message: \r\n\r\n\r\n\r\n" +
            session.startMessage +
            "\r\n\r\n\r\n\r\nTo view more details, please visit the clubhouse website.";

          const htmlMessage: string =
            "<span style='font-weight: bold;'>" +
            user.firstName +
            " " +
            user.lastName +
            "</span> has started a new session with the following message: <br/><br/><br/><p>" +
            session.startMessage +
            "</p>" +
            "<br/><br/><br/><br/><hr/>To view more details, please visit the clubhouse website.";

          // TODO: Fetch email list from userDao
          await sendEmail(["testuser@test.com"], title, message, htmlMessage);

          try {
            await this.ws.broadcastMessage(
              WsMessage(MessageType.SessionStart, req.body.startMessage, userId)
            );
          } catch (err) {
            console.log("WebSocket error: " + err);
          }

          return res
            .status(201)
            .json(MessageFactory.createMessage("Session started"));
        } catch (err) {
          console.log(err);
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Server error: Cannot start a session",
                err as Error
              )
            );
        }
      }
    );
    // Stop a session.
    this.router.post(
      "/stop",
      RequestParamMiddleware("endMessage"),
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        const { endMessage }: { endMessage: string } = req.body;
        try {
          const userId: number = res.locals.token.data.userId;
          const sessions = await this.sessionDao.findOngoingByUser(userId);
          if (sessions) {
            if (sessions.length === 0) {
              return res
                .status(400)
                .json(
                  MessageFactory.createError(
                    "You don't have an ongoing session."
                  )
                );
            } else if (sessions.length > 1) {
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
          const currentSession: Session = sessions[0];
          if (currentSession === undefined) {
            return res
              .status(400)
              .json(MessageFactory.createError("Invalid session"));
          }

          if (currentSession.sessionId === undefined) {
            return res
              .status(400)
              .json(MessageFactory.createError("Invalid session id"));
          }

          if (!isString(endMessage)) {
            return res
              .status(400)
              .json(
                MessageFactory.createError("Invalid format for ending message")
              );
          }

          await this.sessionDao.endSession(
            currentSession.sessionId,
            endMessage
          );

          const user = await this.userDao.findOne(userId);

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
            endMessage +
            "\r\n\r\n\r\n\r\nTo view more details, please visit the clubhouse website.";

          const htmlMessage: string =
            "<span style='font-weight: bold;'>" +
            user.firstName +
            " " +
            user.lastName +
            "</span> has ended a session with the following message: <br/><br/><br/><p>" +
            endMessage +
            "</p>" +
            "<br/><br/><br/><br/><hr/>To view more details, please visit the clubhouse website.";

          // TODO: Fetch email list from userDao
          await sendEmail(["testuser@test.com"], title, message, htmlMessage);

          try {
            await this.ws.broadcastMessage(
              WsMessage(MessageType.SessionEnd, req.body.endMessage, userId)
            );
          } catch (err) {
            console.log("WebSocket error: " + err);
          }

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
                "Server error: Can't end a session",
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
          // This should return only one session, as only one active is permitted
          const sessions = await this.sessionDao.findOngoingByUser(userId);
          const otherSessions = await this.sessionDao.findAllOngoing();
          const peopleCount = otherSessions.length;
          if (sessions.length === 0) {
            return res.status(200).json({
              running: sessions && sessions.length !== 0,
              peopleCount
            });
          } else {
            return res.status(200).json({
              running: sessions && sessions.length !== 0,
              peopleCount,
              startTime: sessions[0].startTime
            });
          }
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Server error", err as Error));
        }
      }
    );
    return this.router;
  }
}
