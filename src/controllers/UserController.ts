import bcrypt from "bcrypt";
import express from "express";

import UserDao from "../dao/UserDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import Controller from "./Controller";

import CalendarEventDao from "../dao/CalendarEventDao";

import {
  DbUser,
  isDbUser,
  Permission,
  User,
  userFilter
} from "@alehuo/clubhouse-shared";
import Validator from "validator";
import MessageDao from "../dao/MessageDao";
import NewsPostDao from "../dao/NewsPostDao";
import SessionDao from "../dao/SessionDao";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { MessageFactory } from "../utils/MessageFactory";

export default class UserController extends Controller {
  constructor(
    private userDao: UserDao,
    private calendarEventDao: CalendarEventDao,
    private messageDao: MessageDao,
    private newsPostDao: NewsPostDao,
    private sessionDao: SessionDao
  ) {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const result = await this.userDao.findAll();
          return res.json(
            MessageFactory.createResponse<User[]>(
              true,
              "Succesfully fetched users",
              result.map(userFilter)
            )
          );
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get all users",
                err as Error
              )
            );
        }
      }
    );

    this.router.get(
      "/ownData",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const userId: number = res.locals.token.data.userId;
          const user = await this.userDao.findOne(userId);
          if (!user) {
            return res
              .status(404)
              .json(MessageFactory.createError("User not found"));
          } else {
            return res
              .status(200)
              .json(
                MessageFactory.createResponse<User>(true, "", userFilter(user))
              );
          }
        } catch (ex) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get a single user",
                ex as Error
              )
            );
        }
      }
    );

    this.router.get(
      "/:userId(\\d+)",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const user = await this.userDao.findOne(req.params.userId);
          if (!user) {
            return res
              .status(404)
              .json(MessageFactory.createError("User not found"));
          } else {
            return res
              .status(200)
              .json(
                MessageFactory.createResponse<User>(true, "", userFilter(user))
              );
          }
        } catch (ex) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get a single user",
                ex as Error
              )
            );
        }
      }
    );

    this.router.put(
      "/:userId(\\d+)",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const userId: number = res.locals.token.data.userId;
          // Check that the JWT's userId matches with the request userId
          // In the future, admin permission check can be used for this functionality.
          if (Number(userId) !== Number(req.params.userId)) {
            return res
              .status(400)
              .json(
                MessageFactory.createError(
                  "You can only edit your own information"
                )
              );
          }
          const user = await this.userDao.findOne(res.locals.token.data.userId);
          if (!user) {
            return res
              .status(404)
              .json(MessageFactory.createError("User not found"));
          } else {
            const errors: string[] = [];
            const { firstName, lastName, email, password }: DbUser = req.body;
            user.firstName = firstName ? firstName : user.firstName;
            user.lastName = lastName ? lastName : user.lastName;
            if (email && user.email !== email) {
              const usr = await this.userDao.findByEmail(email.trim());
              if (usr) {
                return res
                  .status(400)
                  .json(
                    MessageFactory.createError(
                      "Email address is already in use"
                    )
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
              const result: boolean = await this.userDao.update(user);
              if (result) {
                const updatedUser = await this.userDao.findOne(userId);
                return res
                  .status(200)
                  .json(
                    MessageFactory.createResponse<User>(
                      true,
                      "",
                      userFilter(updatedUser)
                    )
                  );
              } else {
                return res
                  .status(400)
                  .json(MessageFactory.createError("Error editing user"));
              }
            } else {
              return res
                .status(400)
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
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot edit user",
                ex as Error
              )
            );
        }
      }
    );

    this.router.post(
      "",
      RequestParamMiddleware("email", "firstName", "lastName", "password"),
      async (req: express.Request, res: express.Response) => {
        try {
          const { email, firstName, lastName, password }: DbUser = req.body;
          const user = await this.userDao.findByEmail(email.trim());

          if (user) {
            return res
              .status(400)
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
                .status(400)
                .json(
                  MessageFactory.createError(
                    "Error registering user",
                    undefined,
                    errors
                  )
                );
            }

            const userToSave: DbUser = {
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
                .status(400) // TODO: Should we return HTTP 500 on this kind of error?
                .json(
                  MessageFactory.createError(
                    "The request did not contain a valid user object."
                  )
                );
            }

            const savedUser = await this.userDao.save(userToSave);
            const savedDbUser = await this.userDao.findOne(savedUser[0]);

            return res
              .status(201)
              .json(MessageFactory.createResponse<User>(true, "", savedDbUser));
          }
        } catch (err) {
          return res
            .status(500)
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
      async (req: express.Request, res: express.Response) => {
        try {
          const user = await this.userDao.findOne(req.params.userId);
          if (!user) {
            return res
              .status(404)
              .json(MessageFactory.createError("User not found"));
          } else {
            if (Number(res.locals.token.data.userId) === Number(user.userId)) {
              return res
                .status(400)
                .json(
                  MessageFactory.createError(
                    "You cannot delete yourself. Please contact a server admin to do this operation."
                  )
                );
            }
            const userId = Number(user.userId);
            const calendarEvents = await this.calendarEventDao.findCalendarEventsByUser(
              userId
            );
            await Promise.all(
              calendarEvents.map((event) => {
                if (event.eventId !== undefined) {
                  this.calendarEventDao.remove(event.eventId);
                }
              })
            );
            // Remove messages
            const messages = await this.messageDao.findByUser(userId);
            await Promise.all(
              messages.map((msg) => {
                if (msg.messageId !== undefined) {
                  this.messageDao.remove(msg.messageId);
                }
              })
            );
            // Remove newsposts
            const newsPosts = await this.newsPostDao.findByAuthor(userId);
            await Promise.all(
              newsPosts.map((newsPost) => {
                if (newsPost.postId !== undefined) {
                  this.newsPostDao.remove(newsPost.postId);
                }
              })
            );
            // Remove sessions
            const sessions = await this.sessionDao.findByUser(userId);
            await Promise.all(
              sessions.map((session) => this.sessionDao.remove(session.sessionId))
            );
            // Remove user data
            await this.userDao.remove(userId);

            return res
              .status(200)
              .json(
                MessageFactory.createMessage(
                  "User deleted from the server (including his/her created calendar events" +
                    ", messages, sessions and newsposts.)"
                )
              );
          }
        } catch (ex) {
          console.log(ex);
          return res
            .status(500)
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
