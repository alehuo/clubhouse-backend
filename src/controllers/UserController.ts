import bcrypt from "bcrypt";
import express from "express";

import UserDao from "../dao/UserDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import Controller from "./Controller";

import CalendarEventDao from "../dao/CalendarEventDao";

import {
  DbUser,
  isCalendarEvent,
  isDbUser,
  isKey,
  isMessage,
  isNewspost,
  isSession,
  Permission,
  User,
  userFilter
} from "@alehuo/clubhouse-shared";
import { isString } from "util";
import Validator from "validator";
import KeyDao from "../dao/KeyDao";
import MessageDao from "../dao/MessageDao";
import NewsPostDao from "../dao/NewsPostDao";
import SessionDao from "../dao/SessionDao";
import { logger } from "../index";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import { StatusCode } from "../utils/StatusCodes";

export default class UserController extends Controller {
  constructor(
    private userDao: UserDao,
    private calendarEventDao: CalendarEventDao,
    private messageDao: MessageDao,
    private newsPostDao: NewsPostDao,
    private sessionDao: SessionDao,
    private keyDao: KeyDao
  ) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", JWTMiddleware, async (req, res) => {
      try {
        const result = await this.userDao.findAll();
        if (!result.every(isDbUser)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("DbUser"));
        }
        return res
          .status(StatusCode.OK)
          .json(
            MessageFactory.createResponse<User[]>(
              true,
              "Succesfully fetched users",
              result.map(userFilter)
            )
          );
      } catch (err) {
        logger.error(err);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Internal server error: Cannot get all users",
              err as Error
            )
          );
      }
    });

    this.router.get("/ownData", JWTMiddleware, async (req, res) => {
      try {
        const userId = Number(res.locals.token.data.userId);
        const user = await this.userDao.findOne(userId);
        if (!user) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("User not found"));
        } else {
          if (!isDbUser(user)) {
            return res
              .status(StatusCode.INTERNAL_SERVER_ERROR)
              .json(MessageFactory.createModelValidationError("DbUser"));
          }
          return res
            .status(StatusCode.OK)
            .json(
              MessageFactory.createResponse<User>(true, "", userFilter(user))
            );
        }
      } catch (ex) {
        logger.error(ex);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot get a single user",
              ex as Error
            )
          );
      }
    });

    this.router.get("/:userId(\\d+)", JWTMiddleware, async (req, res) => {
      try {
        const userId = Number(req.params.userId);
        const user = await this.userDao.findOne(userId);
        if (!user) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("User not found"));
        } else {
          if (!isDbUser(user)) {
            return res
              .status(StatusCode.INTERNAL_SERVER_ERROR)
              .json(MessageFactory.createModelValidationError("DbUser"));
          }
          return res
            .status(StatusCode.OK)
            .json(
              MessageFactory.createResponse<User>(true, "", userFilter(user))
            );
        }
      } catch (ex) {
        logger.error(ex);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot get a single user",
              ex as Error
            )
          );
      }
    });

    this.router.put("/:userId(\\d+)", JWTMiddleware, async (req, res) => {
      try {
        const userId = Number(res.locals.token.data.userId);
        const routeUserId = Number(req.params.userId);
        // Check that the JWT's userId matches with the request userId
        // In the future, admin permission check can be used for this functionality.
        if (userId !== routeUserId) {
          return res
            .status(StatusCode.BAD_REQUEST)
            .json(
              MessageFactory.createError(
                "You can only edit your own information"
              )
            );
        }
        const user = await this.userDao.findOne(userId);
        if (!user) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("User not found"));
        } else {
          const errors: string[] = [];
          const {
            firstName,
            lastName,
            email,
            password
          }: Pick<DbUser, "firstName" | "lastName" | "email" | "password"> = req.body;
          user.firstName = firstName ? firstName : user.firstName;
          user.lastName = lastName ? lastName : user.lastName;
          if (email && user.email !== email) {
            const usr = await this.userDao.findByEmail(email.trim());
            if (usr) {
              return res
                .status(StatusCode.BAD_REQUEST)
                .json(
                  MessageFactory.createError("Email address is already in use")
                );
            }
          }
          user.email = email ? email : user.email;
          if (
            firstName &&
            !(
              Validator.isLength(firstName, {
                max: 255
              }) && !Validator.isEmpty(firstName)
            )
          ) {
            errors.push(
              "First name cannot be empty or longer than 255 characters"
            );
          }
          if (
            lastName &&
            !Validator.isLength(lastName, {
              min: 2,
              max: 255
            })
          ) {
            errors.push(
              "Last name cannot be empty or longer than 255 characters"
            );
          }
          if (email && !Validator.isEmail(email)) {
            errors.push("Email address is invalid");
          }
          if (
            password &&
            !Validator.isLength(password, {
              min: 8
            })
          ) {
            errors.push(
              "Password cannot be empty or shorter than 8 characters"
            );
          } else {
            user.password = password
              ? bcrypt.hashSync(password, bcrypt.genSaltSync(10))
              : user.password;
          }
          if (errors.length === 0) {
            const result = await this.userDao.update(user);
            if (result) {
              const updatedUser = await this.userDao.findOne(userId);
              return res
                .status(StatusCode.OK)
                .json(
                  MessageFactory.createResponse<User>(
                    true,
                    "",
                    userFilter(updatedUser)
                  )
                );
            } else {
              return res
                .status(StatusCode.BAD_REQUEST)
                .json(MessageFactory.createError("Error editing user"));
            }
          } else {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(
                MessageFactory.createError(
                  "Error editing user information",
                  undefined,
                  errors
                )
              );
          }
        }
      } catch (ex) {
        logger.error(ex);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot edit user",
              ex as Error
            )
          );
      }
    });

    this.router.post(
      "",
      RequestParamMiddleware<DbUser>(
        "email",
        "firstName",
        "lastName",
        "password"
      ),
      async (req, res) => {
        try {
          const {
            email,
            firstName,
            lastName,
            password
          }: Pick<DbUser, "email" | "firstName" | "lastName" | "password"> = req.body;

          if (
            !isString(email) ||
            !isString(firstName) ||
            !isString(lastName) ||
            !isString(password)
          ) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Invalid request params"));
          }

          const user = await this.userDao.findByEmail(email.trim());

          if (user) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("User already exists"));
          } else {
            const errors: string[] = [];
            if (
              !Validator.isLength(firstName, {
                min: 2,
                max: 255
              })
            ) {
              errors.push(
                "First name cannot be shorter than 2 or longer than 255 characters"
              );
            }
            if (
              !Validator.isLength(lastName, {
                min: 2,
                max: 255
              })
            ) {
              errors.push(
                "Last name cannot be shorter than 2 or longer than 255 characters"
              );
            }
            if (!Validator.isEmail(email)) {
              errors.push("Email address is invalid");
            }
            if (!Validator.isLength(password, { min: 8 })) {
              errors.push(
                "Password cannot be empty or shorter than 8 characters"
              );
            }

            if (errors.length > 0) {
              return res
                .status(StatusCode.BAD_REQUEST)
                .json(
                  MessageFactory.createError(
                    "Error registering user",
                    undefined,
                    errors
                  )
                );
            }

            const userToSave: Partial<DbUser> = {
              email,
              firstName,
              lastName,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
              permissions: 8,
              created_at: "",
              updated_at: "",
              userId: -1
            };
            if (!isDbUser(userToSave)) {
              return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json(MessageFactory.createModelValidationError("User"));
            }

            const savedUser = await this.userDao.save(userToSave);
            const savedDbUser = await this.userDao.findOne(savedUser[0]);

            return res
              .status(StatusCode.CREATED)
              .json(
                MessageFactory.createResponse<User>(
                  true,
                  "",
                  userFilter(savedDbUser)
                )
              );
          }
        } catch (err) {
          logger.error(err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot add user",
                err as Error
              )
            );
        }
      }
    );

    this.router.delete(
      "/:userId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_REMOVE_USER),
      async (req, res) => {
        const userId = Number(req.params.userId);
        const localUserId = Number(res.locals.token.data.userId);
        try {
          const user = await this.userDao.findOne(userId);
          if (!user) {
            return res
              .status(StatusCode.NOT_FOUND)
              .json(MessageFactory.createError("User not found"));
          } else {
            if (!isDbUser(user)) {
              return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json(MessageFactory.createModelValidationError("DbUser"));
            }
            if (localUserId === user.userId) {
              return res
                .status(StatusCode.BAD_REQUEST)
                .json(
                  MessageFactory.createError(
                    "You cannot delete yourself. Please contact a server admin to do this operation."
                  )
                );
            }
            const calendarEvents = await this.calendarEventDao.findCalendarEventsByUser(
              user.userId
            );
            if (!calendarEvents.every(isCalendarEvent)) {
              return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json(
                  MessageFactory.createModelValidationError("CalendarEvent")
                );
            }
            await Promise.all(
              calendarEvents.map((event) =>
                this.calendarEventDao.remove(event.eventId)
              )
            );
            // Remove messages
            const messages = await this.messageDao.findByUser(userId);
            if (!messages.every(isMessage)) {
              return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json(MessageFactory.createModelValidationError("Message"));
            }
            await Promise.all(
              messages.map((msg) => this.messageDao.remove(msg.messageId))
            );
            // Remove newsposts
            const newsPosts = await this.newsPostDao.findByAuthor(userId);
            if (!newsPosts.every(isNewspost)) {
              return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json(MessageFactory.createModelValidationError("NewsPost"));
            }
            await Promise.all(
              newsPosts.map((newsPost) =>
                this.newsPostDao.remove(newsPost.postId)
              )
            );
            // Remove sessions
            const sessions = await this.sessionDao.findByUser(userId);
            if (!sessions.every(isSession)) {
              return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json(MessageFactory.createModelValidationError("Session"));
            }
            await Promise.all(
              sessions.map((session) => this.sessionDao.remove(session.sessionId))
            );

            // Remove keys
            const keys = await this.keyDao.findByUser(userId);
            if (!keys.every(isKey)) {
              return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json(MessageFactory.createModelValidationError("Key"));
            }
            await Promise.all(keys.map((key) => this.keyDao.remove(key.keyId)));

            // Remove user data
            await this.userDao.remove(userId);

            return res
              .status(StatusCode.OK)
              .json(
                MessageFactory.createMessage(
                  "User deleted from the server (including his/her created calendar events" +
                    ", messages, sessions and newsposts.)"
                )
              );
          }
        } catch (ex) {
          logger.error(ex);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot delete user",
                ex as Error
              )
            );
        }
      }
    );

    return this.router;
  }
}
