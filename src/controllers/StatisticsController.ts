import express from "express";

import { isStatistics, Statistics } from "@alehuo/clubhouse-shared";
import StatisticsDao from "../dao/StatisticsDao";
import UserDao from "../dao/UserDao";
import { logger } from "../index";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import { StatusCode } from "../utils/StatusCodes";
import Controller from "./Controller";

/**
 * Statistics controller.
 */
export default class StatisticsController extends Controller {
  constructor(private statisticsDao: StatisticsDao, private userDao: UserDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", JWTMiddleware, async (req, res) => {
      try {
        const result = await this.statisticsDao.findStatistics();
        if (!isStatistics(result[0])) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("Statistics"));
        }
        return res
          .status(StatusCode.OK)
          .json(MessageFactory.createResponse<Statistics>(true, "", result[0]));
      } catch (err) {
        logger.error(err);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot get statistics",
              err as Error
            )
          );
      }
    });

    this.router.get("/:userId(\\d+)", JWTMiddleware, async (req, res) => {
      try {
        const user = await this.userDao.findOne(req.params.userId);
        if (!user) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("User not found"));
        }
        const result = await this.statisticsDao.findStatisticsFromUser(
          req.params.userId
        );

        if (result && result.length === 1) {
          return res.status(StatusCode.OK).json(result);
        } else {
          return res
            .status(404)
            .json(MessageFactory.createError("Statistics not found"));
        }
      } catch (err) {
        logger.error(err);
        return res
          .status(500)
          .json(
            MessageFactory.createError(
              "Internal server error: Cannot get statistics from a user",
              err as Error
            )
          );
      }
    });

    return this.router;
  }
}
