import express from "express";
import SessionDao from "../dao/SessionDao";
import Controller from "./Controller";

import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";

import { isSession, Session, sessionFilter } from "@alehuo/clubhouse-shared";
import moment from "moment";
import { isString } from "util";
import UserDao from "../dao/UserDao";
import { dtFormat, logger } from "../index";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { sendEmail } from "../utils/Mailer";
import { StatusCode } from "../utils/StatusCodes";
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
    this.router.get("/ongoing", JWTMiddleware, async (req, res) => {
      try {
        const sessions = await this.sessionDao.findAllOngoing();
        if (!sessions.every(isSession)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("Session"));
        }
        return res
          .status(StatusCode.OK)
          .json(
            MessageFactory.createResponse<Session[]>(
              true,
              "",
              sessions.map(sessionFilter)
            )
          );
      } catch (err) {
        logger.error(err);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot get ongoing sessions",
              err as Error
            )
          );
      }
    });
    // All sessions from a single user
    this.router.get("/user/:userId(\\d+)", JWTMiddleware, async (req, res) => {
      try {
        const sessions = await this.sessionDao.findByUser(req.params.userId);
        if (!sessions.every(isSession)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("Session"));
        }
        return res
          .status(StatusCode.OK)
          .json(
            MessageFactory.createResponse<Session[]>(
              true,
              "",
              sessions.map(sessionFilter)
            )
          );
      } catch (err) {
        logger.error(err);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot get sessions from a single user",
              err as Error
            )
          );
      }
    });
    // All sessions from a single user that are currently running
    this.router.get(
      "/ongoing/user/:userId(\\d+)",
      JWTMiddleware,
      async (req, res) => {
        try {
          const sessions = await this.sessionDao.findOngoingByUser(
            req.params.userId
          );
          if (!sessions.every(isSession)) {
            return res
              .status(StatusCode.INTERNAL_SERVER_ERROR)
              .json(MessageFactory.createModelValidationError("Session"));
          }
          return res
            .status(StatusCode.OK)
            .json(
              MessageFactory.createResponse<Session[]>(
                true,
                "",
                sessions.map(sessionFilter)
              )
            );
        } catch (err) {
          logger.error(err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
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
      RequestParamMiddleware<Session>("startMessage"),
      JWTMiddleware,
      async (req, res) => {
        const { startMessage }: Partial<Session> = req.body;

        if (!isString(startMessage)) {
          return res.status(400).json("Invalid format for start message.");
        }

        try {
          const userId = Number(res.locals.token.data.userId);
          const sessions = await this.sessionDao.findOngoingByUser(userId);
          if (sessions && sessions.length > 0) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(
                MessageFactory.createError(
                  "You already have an ongoing session running."
                )
              );
          }
          const session: Partial<Session> = {
            sessionId: -1, // Placeholder
            userId,
            startMessage,
            endMessage: "",
            startTime: moment().format(dtFormat),
            endTime: moment().format(dtFormat),
            ended: 0,
            started: 1,
            created_at: "", // Placeholder
            updated_at: "" // Placeholder
          };

          if (!isSession(session)) {
            return res
              .status(StatusCode.INTERNAL_SERVER_ERROR)
              .json(MessageFactory.createModelValidationError("Session"));
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

          const htmlMessage =
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
            logger.error(err);
          }

          return res
            .status(StatusCode.CREATED)
            .json(MessageFactory.createMessage("Session started"));
        } catch (err) {
          logger.error(err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
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
      RequestParamMiddleware<Session>("endMessage"),
      JWTMiddleware,
      async (req, res) => {
        const { endMessage }: Partial<Session> = req.body;
        try {
          const userId = Number(res.locals.token.data.userId);
          const sessions = await this.sessionDao.findOngoingByUser(userId);
          if (sessions) {
            if (sessions.length === 0) {
              return res
                .status(StatusCode.BAD_REQUEST)
                .json(
                  MessageFactory.createError(
                    "You don't have an ongoing session."
                  )
                );
            } else if (sessions.length > 1) {
              return res
                .status(StatusCode.BAD_REQUEST)
                .json(
                  MessageFactory.createError(
                    "You have more than one session running." +
                      "Please contact a system administrator and use the email system as a backup."
                  )
                );
            }
          }
          const currentSession = sessions[0];
          if (currentSession === undefined) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Invalid session"));
          }

          if (currentSession.sessionId === undefined) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Invalid session id"));
          }

          if (!isString(endMessage)) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(
                MessageFactory.createError("Invalid format for ending message")
              );
          }

          await this.sessionDao.endSession(
            currentSession.sessionId,
            endMessage
          );

          const user = await this.userDao.findOne(userId);

          const title =
            (process.env.MAIL_PREFIX
              ? "[" + process.env.MAIL_PREFIX + "]: "
              : "") +
            user.firstName +
            " " +
            user.lastName +
            " has ended a session";

          const message =
            user.firstName +
            " " +
            user.lastName +
            " has ended a session with the following message: \r\n\r\n\r\n\r\n" +
            endMessage +
            "\r\n\r\n\r\n\r\nTo view more details, please visit the clubhouse website.";

          const htmlMessage =
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
            logger.error(err);
          }

          return res
            .status(StatusCode.OK)
            .json(
              MessageFactory.createMessage(
                "Session ended with message '" + req.body.endMessage + "'"
              )
            );
        } catch (err) {
          logger.error(err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Server error: Can't end a session",
                err as Error
              )
            );
        }
      }
    );
    this.router.get("/ownstatus", JWTMiddleware, async (req, res) => {
      try {
        const userId: number = res.locals.token.data.userId;
        // This should return only one session, as only one active is permitted
        const sessions = await this.sessionDao.findOngoingByUser(userId);
        const otherSessions = await this.sessionDao.findAllOngoing();
        const peopleCount = otherSessions.length;
        if (sessions.length === 0) {
          // TODO: Typings
          return res.status(StatusCode.OK).json(
            MessageFactory.createResponse<any>(true, "", {
              running: sessions && sessions.length !== 0,
              peopleCount
            })
          );
        } else {
          // TODO: Typings
          return res.status(StatusCode.OK).json(
            MessageFactory.createResponse<any>(true, "", {
              running: sessions && sessions.length !== 0,
              peopleCount,
              startTime: sessions[0].startTime
            })
          );
        }
      } catch (err) {
        logger.error(err);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(MessageFactory.createError("Server error", err as Error));
      }
    });
    return this.router;
  }
}
