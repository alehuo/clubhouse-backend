import { isKey, Key } from "@alehuo/clubhouse-shared";
import moment from "moment";
import { isNumber, isString } from "util";
import KeyDao from "../dao/KeyDao";
import KeyTypeDao from "../dao/KeyTypeDao";
import StudentUnionDao from "../dao/StudentUnionDao";
import UserDao from "../dao/UserDao";
import { logger } from "../logger";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { dtFormat } from "../utils/DtFormat";
import { MessageFactory } from "../utils/MessageFactory";
import { StatusCode } from "../utils/StatusCodes";
import Controller from "./Controller";

class KeyController extends Controller {
  constructor() {
    super();
  }
  public routes() {
    this.router.get("", JWTMiddleware, async (req, res) => {
      try {
        const keys = await KeyDao.findAll();
        if (keys.every(isKey)) {
          return res
            .status(StatusCode.OK)
            .json(MessageFactory.createResponse<Key[]>(true, "", keys));
        }
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(MessageFactory.createModelValidationError("Key"));
      } catch (err) {
        logger.error(err);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(MessageFactory.createError("Server error: Cannot get keys"));
      }
    });

    this.router.get("/:keyId(\\d+)", JWTMiddleware, async (req, res) => {
      const keyId = Number(req.params.keyId);
      try {
        const key = await KeyDao.findOne(keyId);
        if (!key) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("Key not found"));
        }
        if (isKey(key)) {
          return res
            .status(StatusCode.OK)
            .json(MessageFactory.createResponse<Key>(true, "", key));
        }
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(MessageFactory.createModelValidationError("Key"));
      } catch (err) {
        logger.error(err);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(MessageFactory.createError("Server error: Cannot get key"));
      }
    });
    this.router.post(
      "",
      RequestParamMiddleware<Key>(
        "keyType",
        "unionId",
        "description",
        "userId"
      ),
      JWTMiddleware,
      async (req, res) => {
        const {
          keyType,
          unionId,
          description,
          userId
        }: Partial<Key> = req.body;
        if (
          !isString(description) ||
          !isNumber(userId) ||
          !isNumber(unionId) ||
          !isNumber(keyType)
        ) {
          return res
            .status(StatusCode.BAD_REQUEST)
            .json(MessageFactory.createError("Invalid request params"));
        }
        const newKey: Partial<Key> = {
          keyId: -1, // Placeholder
          description: description.trim(),
          keyType,
          userId,
          unionId,
          dateAssigned: moment().format(dtFormat),
          created_at: "", // Placeholder
          updated_at: "" // Placeholder
        };
        if (!isKey(newKey)) {
          return res
            .status(StatusCode.BAD_REQUEST)
            .json(MessageFactory.createError("Invalid request params"));
        }
        try {
          const dbUser = await UserDao.findOne(userId);
          if (!dbUser) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("User not found"));
          }
          const dbKeyType = await KeyTypeDao.findOne(keyType);
          if (!dbKeyType) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Key type not found"));
          }
          const stdu = await StudentUnionDao.findOne(unionId);
          if (!stdu) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Student union not found"));
          }
          const savedKeyIds = await KeyDao.save(newKey);
          if (savedKeyIds[0]) {
            const savedKey = await KeyDao.findOne(savedKeyIds[0]);
            return res
              .status(StatusCode.CREATED)
              .json(MessageFactory.createResponse<Key>(true, "", savedKey));
          } else {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Error adding new key"));
          }
        } catch (err) {
          logger.error(err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError("Server error: Cannot add new key")
            );
        }
      }
    );

    this.router.delete("/:keyId(\\d+)", JWTMiddleware, async (req, res) => {
      const keyId = Number(req.params.keyId);
      try {
        const key = await KeyDao.findOne(keyId);
        if (!key) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("Key not found"));
        }
        if (!isKey(key)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("Key"));
        }

        await KeyDao.remove(key.keyId);

        return res
          .status(StatusCode.OK)
          .json(MessageFactory.createMessage("Key deleted"));
      } catch (err) {
        logger.error(err);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(MessageFactory.createError("Server error: Cannot delete key"));
      }
    });

    return this.router;
  }
}

export default new KeyController();
