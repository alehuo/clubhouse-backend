import express from "express";

import StatisticsDao from "../dao/StatisticsDao";
import UserDao from "../dao/UserDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
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
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const result = await this.statisticsDao.findStatistics();
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
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const user = await this.userDao.findOne(req.params.userId);
          if (!user) {
            return res
              .status(404)
              .json(MessageFactory.createError("User not found"));
          }
          const result = await this.statisticsDao.findStatisticsFromUser(
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
