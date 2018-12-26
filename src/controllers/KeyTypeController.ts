import { isKeyType, KeyType } from "@alehuo/clubhouse-shared";
import { isString } from "util";
import KeyDao from "../dao/KeyDao";
import KeyTypeDao from "../dao/KeyTypeDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import { StatusCode } from "../utils/StatusCodes";
import Controller from "./Controller";

export default class KeyTypeController extends Controller {
  constructor(private keyTypeDao: KeyTypeDao, private keyDao: KeyDao) {
    super();
  }

  public routes() {
    this.router.get("", JWTMiddleware, async (req, res) => {
      try {
        const keyTypes = await this.keyTypeDao.findAll();
        if (keyTypes.every(isKeyType)) {
          return res
            .status(StatusCode.OK)
            .json(MessageFactory.createResponse<KeyType[]>(true, "", keyTypes));
        }
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(MessageFactory.createModelValidationError("KeyType"));
      } catch (err) {
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError("Server error: Cannot get key types")
          );
      }
    });

    this.router.get("/:keyTypeId(\\d+)", JWTMiddleware, async (req, res) => {
      const keyTypeId = Number(req.params.keyTypeId);
      try {
        const keyType = await this.keyTypeDao.findOne(keyTypeId);
        if (!keyType) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("Key type not found"));
        }
        if (isKeyType(keyType)) {
          return res
            .status(StatusCode.OK)
            .json(MessageFactory.createResponse<KeyType>(true, "", keyType));
        }
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(MessageFactory.createModelValidationError("KeyType"));
      } catch (err) {
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError("Server error: Cannot get key types")
          );
      }
    });
    // TODO: DELETE, PATCH and PUT routes and permission checking
    this.router.post(
      "",
      RequestParamMiddleware<KeyType>("title"),
      JWTMiddleware,
      async (req, res) => {
        const { title }: Partial<KeyType> = req.body;
        if (!isString(title)) {
          return res
            .status(StatusCode.BAD_REQUEST)
            .json(MessageFactory.createError("Invalid request params"));
        }
        const newKeyType = {
          keyTypeId: -1, // Placeholder
          title: title.trim(),
          created_at: "", // Placeholder
          updated_at: "" // Placeholder
        };
        if (!isKeyType(newKeyType)) {
          return res
            .status(StatusCode.BAD_REQUEST)
            .json(MessageFactory.createError("Invalid request params"));
        }
        try {
          const savedKeyTypeIds = await this.keyTypeDao.save(newKeyType);
          if (savedKeyTypeIds[0]) {
            const savedKeyType = await this.keyTypeDao.findOne(
              savedKeyTypeIds[0]
            );
            return res
              .status(StatusCode.CREATED)
              .json(
                MessageFactory.createResponse<KeyType>(true, "", savedKeyType)
              );
          } else {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Error adding new key type"));
          }
        } catch (err) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Server error: Cannot add new key type"
              )
            );
        }
      }
    );

    this.router.delete("/:keyTypeId(\\d+)", JWTMiddleware, async (req, res) => {
      const keyTypeId = Number(req.params.keyTypeId);
      try {
        const keyType = await this.keyTypeDao.findOne(keyTypeId);
        if (!keyType) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("Key type not found"));
        }
        if (!isKeyType(keyType)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("KeyType"));
        }
        const keys = await this.keyDao.findByKeyType(keyType.keyTypeId);
        if (keys && keys.length > 0) {
          return res
            .status(StatusCode.BAD_REQUEST)
            .json(
              MessageFactory.createError(
                "You can't delete a key type if you have keys assigned to it."
              )
            );
        }

        // If there are no keys assigned to the key type, allow deleting it.
        await this.keyTypeDao.remove(keyType.keyTypeId);

        return res
          .status(StatusCode.OK)
          .json(MessageFactory.createMessage("Key type deleted"));
      } catch (err) {
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError("Server error: Cannot get key types")
          );
      }
    });

    return this.router;
  }
}
