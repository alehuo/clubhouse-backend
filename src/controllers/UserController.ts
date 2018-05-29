import * as express from "express";
import * as bcrypt from "bcrypt";
import IUser, { userFilter } from "../models/IUser";

import Controller from "./Controller";
import UserDao from "../dao/UserDao";
import PermissionDao from "../dao/PermissionDao";
import JwtMiddleware from "./../middleware/JWTMiddleware";

import CalendarEventDao from "../dao/CalendarEventDao";
import ICalendarEvent from "../models/ICalendarEvent";

import Validator from "./../utils/Validator";
import MessageFactory from "../Utils/MessageFactory";
import IStudentUnion from "../models/IStudentUnion";
import StudentUnionDao from "../dao/StudentUnionDao";
import IMessage from "../models/IMessage";
import MessageDao from "../dao/MessageDao";
import INewsPost from "../models/INewsPost";
import NewsPostDao from "../dao/NewsPostDao";
import WatchDao from "../dao/WatchDao";
import IWatch from "../models/IWatch";

export default class UserController extends Controller {
  constructor(
    private userDao: UserDao,
    private calendarEventDao: CalendarEventDao,
    private studentUnionDao: StudentUnionDao,
    private messageDao: MessageDao,
    private newsPostDao: NewsPostDao,
    private watchDao: WatchDao
  ) {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const result: IUser[] = await this.userDao.findAll();
          return res.json(result.map(userFilter));
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error: Cannot get all users"));
        }
      }
    );

    this.router.get(
      "/:userId(\\d+)",
      JwtMiddleware,
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
            .json(MessageFactory.createError("Internal server error: Cannot get a single user"));
        }
      }
    );

    this.router.put(
      "/:userId(\\d+)",
      JwtMiddleware,
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
            user.firstName = req.body.firstName
              ? req.body.firstName
              : user.firstName;
            user.lastName = req.body.lastName
              ? req.body.lastName
              : user.lastName;
            if (req.body.email && user.email !== req.body.email) {
              const usr: IUser = await this.userDao.findByEmail(req.body.email);
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
            user.email = req.body.email ? req.body.email : user.email;
            if (
              !Validator.validateStringLength.minMax(user.firstName, 2, 255)
            ) {
              errors.push(
                "First name cannot be shorter than 2 or longer than 255 characters"
              );
            }
            if (!Validator.validateStringLength.minMax(user.lastName, 2, 255)) {
              errors.push(
                "Last name cannot be shorter than 2 or longer than 255 characters"
              );
            }
            if (!Validator.validateStringLength.minMax(user.email, 10, 255)) {
              errors.push(
                "Email address cannot be shorter than 10 or longer than 255 characters"
              );
            }
            if (
              req.body.password &&
              !Validator.validateStringLength.min(req.body.password, 8)
            ) {
              errors.push(
                "Password cannot be empty or shorter than 8 characters"
              );
            } else {
              user.password = req.body.password
                ? bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
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
                    errors
                  )
                );
            }
          }
        } catch (ex) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error: Cannot edit user"));
        }
      }
    );

    this.router.post(
      "",
      async (req: express.Request, res: express.Response) => {
        try {
          const userData: {
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            unionId: number;
            password: string;
          } =
            req.body;
          if (
            !(
              userData.email &&
              userData.firstName &&
              userData.lastName &&
              userData.unionId &&
              userData.password
            )
          ) {
            return res
              .status(500)
              .json(
                MessageFactory.createError("Missing request body parameters")
              );
          } else {
            const user: IUser = await this.userDao.findByEmail(userData.email);

            if (user) {
              return res
                .status(400)
                .json(MessageFactory.createError("User already exists"));
            } else {
              const errors: string[] = [];

              const stdu: IStudentUnion = await this.studentUnionDao.findOne(
                userData.unionId
              );
              if (!stdu) {
                errors.push("Student union does not exist");
              }

              if (
                !Validator.validateStringLength.minMax(
                  userData.firstName,
                  0,
                  255
                )
              ) {
                errors.push(
                  "First name cannot be shorter than 2 or longer than 255 characters"
                );
              }
              if (
                !Validator.validateStringLength.minMax(
                  userData.lastName,
                  2,
                  255
                )
              ) {
                errors.push(
                  "Last name cannot be shorter than 2 or longer than 255 characters"
                );
              }
              if (
                !Validator.validateStringLength.minMax(userData.email, 10, 255)
              ) {
                errors.push(
                  "Email address cannot be shorter than 10 or longer than 255 characters"
                );
              }
              if (!Validator.validateStringLength.min(userData.password, 8)) {
                errors.push(
                  "Password cannot be empty or shorter than 8 characters"
                );
              }

              if (errors.length > 0) {
                return res
                  .status(400)
                  .json(
                    MessageFactory.createError("Error registering user", errors)
                  );
              }

              const savedUser: number[] = await this.userDao.save({
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                unionId: userData.unionId,
                password: bcrypt.hashSync(
                  req.body.password,
                  bcrypt.genSaltSync(10)
                ),
                permissions: 8
              });

              return res
                .status(201)
                .json(Object.assign({}, userData, { userId: savedUser[0] }));
            }
          }
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error: Cannot add user"));
        }
      }
    );

    this.router.delete(
      "/:userId(\\d+)",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const user: IUser = await this.userDao.findOne(req.params.userId);
          if (!user) {
            return res
              .status(404)
              .json(MessageFactory.createError("User not found"));
          } else {
            if (Number(res.locals.token.data.userId) !== Number(user.userId)) {
              return res
                .status(400)
                .json(
                  MessageFactory.createError(
                    "You can only delete your own user account"
                  )
                );
            }
            // Remove calendar events
            const calendarEvents: ICalendarEvent[] = await this.calendarEventDao.findCalendarEventsByUser(
              res.locals.token.data.userId
            );
            await Promise.all(
              calendarEvents.map(event =>
                this.calendarEventDao.remove(event.eventId)
              )
            );
            // Remove messages
            const messages: IMessage[] = await this.messageDao.findByUser(
              res.locals.token.data.userId
            );
            await Promise.all(
              messages.map(msg => this.messageDao.remove(msg.messageId))
            );
            // Remove newsposts
            const newsPosts: INewsPost[] = await this.newsPostDao.findByAuthor(
              res.locals.token.data.userId
            );
            await Promise.all(
              newsPosts.map(newsPost =>
                this.newsPostDao.remove(newsPost.postId)
              )
            );
            // Remove watches
            const watches: IWatch[] = await this.watchDao.findByUser(
              res.locals.token.data.userId
            );
            await Promise.all(
              watches.map(watch => this.watchDao.remove(watch.watchId))
            );
            // Remove user
            await this.userDao.remove(res.locals.token.data.userId);

            return res
              .status(200)
              .json(
                MessageFactory.createMessage(
                  "User deleted from the server (including his calendar events, messages, watches and newsposts.)"
                )
              );
          }
        } catch (ex) {
          console.log(ex);
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error: Cannot delete user"));
        }
      }
    );

    return this.router;
  }
}
