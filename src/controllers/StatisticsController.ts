import * as express from "express";

import UserDao from "../dao/UserDao";
import JwtMiddleware from "../middleware/JWTMiddleware";
import IStatistics from "../models/IStatistics";
import IUser from "../models/IUser";
import IUserStatistics from "../models/IUserStatistics";
import MessageFactory from "../Utils/MessageFactory";
import StatisticsDao from "./../dao/StatisticsDao";
import Controller from "./Controller";

/**
 * Statistics controller.
 */
export default class StatisticsController extends Controller {
  constructor(private statisticsDao: StatisticsDao, private userDao: UserDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const result: IStatistics[] = await this.statisticsDao.findStatistics();
          return res.json(result[0]);
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get statistics",
                err as Error
              )
            );
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
          }
          const result: IUserStatistics[] = await this.statisticsDao.findStatisticsFromUser(
            req.params.userId
          );
          if (result && result.length === 1) {
            return res.json(result);
          } else {
            return res
              .status(404)
              .json(MessageFactory.createError("Statistics not found"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get statistics from a user",
                err as Error
              )
            );
        }
      }
    );

    return this.router;
  }
}
