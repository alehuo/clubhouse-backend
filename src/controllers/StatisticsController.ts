import { isStatistics, Statistics } from "@alehuo/clubhouse-shared";
import StatisticsDao from "../dao/StatisticsDao";
import UserDao from "../dao/UserDao";
import { logger } from "../logger";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import { StatusCode } from "../utils/StatusCodes";
import Controller from "./Controller";

/**
 * Statistics controller.
 */
class StatisticsController extends Controller {
  constructor() {
    super();
  }
  public routes() {
    this.router.get("", JWTMiddleware, async (req, res) => {
      try {
        const result = await StatisticsDao.findStatistics();
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
        const user = await UserDao.findOne(Number(req.params.userId));
        if (!user) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("User not found"));
        }
        const result = await StatisticsDao.findStatisticsFromUser(
          Number(req.params.userId)
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

export default new StatisticsController();
