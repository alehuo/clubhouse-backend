import { isKeyType, KeyType } from "@alehuo/clubhouse-shared";
import KeyTypeDao from "../dao/KeyTypeDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import { StatusCode } from "../utils/StatusCodes";
import Controller from "./Controller";

export default class KeyTypeController extends Controller {
  constructor(private keyTypeDao: KeyTypeDao) {
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
    return this.router;
  }
}
