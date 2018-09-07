import * as bcrypt from "bcrypt";
import * as express from "express";
import { IUser, userFilter } from "../models/IUser";

import UserDao from "../dao/UserDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import Controller from "./Controller";

import CalendarEventDao from "../dao/CalendarEventDao";
import { ICalendarEvent } from "../models/ICalendarEvent";

import { Permissions } from "@alehuo/clubhouse-shared";
import * as Validator from "validator";
import MessageDao from "../dao/MessageDao";
import NewsPostDao from "../dao/NewsPostDao";
import WatchDao from "../dao/WatchDao";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { IMessage } from "../models/IMessage";
import { INewsPost } from "../models/INewsPost";
import { IWatch } from "../models/IWatch";
import { MessageFactory } from "../utils/MessageFactory";

export default class UserController extends Controller {
  constructor(
    private userDao: UserDao,
    private calendarEventDao: CalendarEventDao,
    private messageDao: MessageDao,
    private newsPostDao: NewsPostDao,
    private watchDao: WatchDao
  ) {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const result: IUser[] = await this.userDao.findAll();
          return res.json(result.map(userFilter));
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
      "/:userId(\\d+)",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const user: IUser = await this.userDao.findOne(req.params.userId);
          if (!user) {
            return res
              .status(404)
              .json(MessageFactory.createError("User not found"));
          } else {
            return res.status(200).json(userFilter(user));
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
          const user: IUser = await this.userDao.findOne(
            res.locals.token.data.userId
          );
          if (!user) {
            return res
              .status(404)
              .json(MessageFactory.createError("User not found"));
          } else {
            const errors: string[] = [];
            const { firstName, lastName, email, password }: IUser = req.body;
            user.firstName = firstName ? firstName : user.firstName;
            user.lastName = lastName ? lastName : user.lastName;
            if (email && user.email !== email) {
              const usr: IUser = await this.userDao.findByEmail(email.trim());
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
                const updatedUser: IUser = await this.userDao.findOne(userId);
                return res.status(200).json(userFilter(updatedUser));
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
                    null,
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
          const { email, firstName, lastName, password }: IUser = req.body;

          const user: IUser = await this.userDao.findByEmail(email.trim());

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
                    null,
                    errors
                  )
                );
            }

            const savedUser: number[] = await this.userDao.save({
              email,
              firstName,
              lastName,
              password: bcrypt.hashSync(
                req.body.password,
                bcrypt.genSaltSync(10)
              ),
              permissions: 8
            });

            return res.status(201).json({
              ...{ email, firstName, lastName },
              ...{ userId: savedUser[0] }
            });
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
      PermissionMiddleware(Permissions.ALLOW_REMOVE_USER),
      async (req: express.Request, res: express.Response) => {
        try {
          const user: IUser = await this.userDao.findOne(req.params.userId);
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
            const userId: number = user.userId;
            const calendarEvents: ICalendarEvent[] = await this.calendarEventDao.findCalendarEventsByUser(
              userId
            );
            await Promise.all(
              calendarEvents.map((event: ICalendarEvent) =>
                this.calendarEventDao.remove(event.eventId)
              )
            );
            // Remove messages
            const messages: IMessage[] = await this.messageDao.findByUser(
              userId
            );
            await Promise.all(
              messages.map((msg: IMessage) =>
                this.messageDao.remove(msg.messageId)
              )
            );
            // Remove newsposts
            const newsPosts: INewsPost[] = await this.newsPostDao.findByAuthor(
              userId
            );
            await Promise.all(
              newsPosts.map((newsPost: INewsPost) =>
                this.newsPostDao.remove(newsPost.postId)
              )
            );
            // Remove watches
            // Watches should be only anonymized..
            const watches: IWatch[] = await this.watchDao.findByUser(userId);
            await Promise.all(
              watches.map((watch: IWatch) =>
                this.watchDao.remove(watch.watchId)
              )
            );
            // Remove user data
            await this.userDao.remove(userId);

            return res
              .status(200)
              .json(
                MessageFactory.createMessage(
                  "User deleted from the server (including his/her created calendar events" +
                    ", messages, watches and newsposts.)"
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
