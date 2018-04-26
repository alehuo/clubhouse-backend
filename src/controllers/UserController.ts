import * as express from "express";
import * as bcrypt from "bcrypt";
import IUser, { userFilter } from "../models/IUser";

import Controller from "./Controller";
import UserDao from "../dao/UserDao";
import PermissionDao from "../dao/PermissionDao";
import { JwtMiddleware } from "../JwtUtils";

import MessageFactory from "./../MessageFactory";
import CalendarEventDao from "../dao/CalendarEventDao";
import ICalendarEvent from "../models/ICalendarEvent";

export default class UserController extends Controller {
  constructor(
    private userDao: UserDao,
    private calendarEventDao: CalendarEventDao
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
            .json(MessageFactory.createError("Internal server error"));
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
          console.error(ex);
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
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
          if (userId !== req.params.userId) {
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
            return res.status(200).json(MessageFactory.createError("TODO"));
          }
        } catch (ex) {
          console.error(ex);
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
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
          console.log(req.body);
          if (
            !(
              userData.username &&
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
            const user: IUser = await this.userDao.findByUsername(
              userData.username
            );

            if (user) {
              return res
                .status(400)
                .json(MessageFactory.createError("User already exists"));
            } else {
              if (userData.password.length < 8) {
                return res
                  .status(400)
                  .json(MessageFactory.createError("Password is too short"));
              }

              const savedUser: number[] = await this.userDao.save({
                username: userData.username,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                unionId: userData.unionId,
                password: userData.password,
                permissions: 8
              });

              return res
                .status(201)
                .json(Object.assign({}, userData, { userId: savedUser[0] }));
            }
          }
        } catch (err) {
          console.error(err);
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
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
            // Remove calendar events, messages, newsposts and watches by this user
            const calendarEvents: ICalendarEvent[] = await this.calendarEventDao.findCalendarEventsByUser(
              res.locals.token.data.userid
            );
            await Promise.all(
              calendarEvents.map(event =>
                this.calendarEventDao.remove(event.eventId)
              )
            );
            return res.status(200).json(MessageFactory.createError("Todo"));
          }
        } catch (ex) {
          console.error(ex);
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    return this.router;
  }
}
