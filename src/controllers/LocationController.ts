import LocationDao from "../dao/LocationDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import Controller from "./Controller";

import {
  isLocation,
  Location,
  locationFilter,
  Permission
} from "@alehuo/clubhouse-shared";
import { isString } from "util";
import { logger } from "../logger";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { StatusCode } from "../utils/StatusCodes";

class LocationController extends Controller {
  constructor() {
    super();
  }
  public routes() {
    this.router.get(
      "",
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_VIEW_LOCATIONS),
      async (req, res) => {
        try {
          const result = await LocationDao.findAll();
          if (result.every(isLocation)) {
            return res.status(StatusCode.OK).json(result.map(locationFilter));
          }
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("Location"));
        } catch (err) {
          logger.error(err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Server error: Cannot get all locations",
                err as Error
              )
            );
        }
      }
    );

    this.router.get(
      "/:locationId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_VIEW_LOCATIONS),
      async (req, res) => {
        const locationId = Number(req.params.locationId);
        try {
          const location = await LocationDao.findOne(locationId);
          if (location) {
            if (isLocation(location)) {
              return res
                .status(StatusCode.OK)
                .json(
                  MessageFactory.createResponse<Location>(
                    true,
                    "",
                    locationFilter(location)
                  )
                );
            }
            return res
              .status(StatusCode.INTERNAL_SERVER_ERROR)
              .json(MessageFactory.createModelValidationError("Location"));
          } else {
            return res
              .status(StatusCode.NOT_FOUND)
              .json(MessageFactory.createError("Location not found"));
          }
        } catch (err) {
          logger.error(err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Server error: Cannot get a single location"
              )
            );
        }
      }
    );

    this.router.post(
      "",
      RequestParamMiddleware<Location>("name", "address"),
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_LOCATIONS),
      async (req, res) => {
        try {
          const {
            name,
            address
          }: Pick<Location, "name" | "address"> = req.body;
          if (!isString(name) || !isString(address)) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Invalid request parameters"));
          }
          const location = await LocationDao.findByName(name);
          if (location) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Location already exists"));
          } else {
            const locationObj: Partial<Location> = {
              name: name.trim(),
              address: address.trim(),
              created_at: "", // Placeholder
              locationId: -1, // Placeholder
              updated_at: "" // Placeholder
            };

            if (!isLocation(locationObj)) {
              return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json(MessageFactory.createModelValidationError("Location"));
            }

            const savedLocation = await LocationDao.save(locationObj);

            return res.status(StatusCode.CREATED).json({
              ...locationObj,
              ...{
                locationId: savedLocation[0]
              }
            });
          }
        } catch (err) {
          logger.error(err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot add a new location"
              )
            );
        }
      }
    );

    this.router.delete(
      "/:locationId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_LOCATIONS),
      async (req, res) => {
        const locationId = Number(req.params.locationId);
        try {
          const locations = await LocationDao.findOne(locationId);
          if (locations) {
            const result = await LocationDao.remove(locationId);
            if (result) {
              return res
                .status(StatusCode.OK)
                .json(MessageFactory.createMessage("Location removed"));
            } else {
              return res
                .status(StatusCode.BAD_REQUEST)
                .json(
                  MessageFactory.createMessage("Failed to remove location")
                );
            }
          } else {
            return res
              .status(StatusCode.NOT_FOUND)
              .json(MessageFactory.createError("Location not found"));
          }
        } catch (err) {
          logger.error(err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Server error: Cannot delete a location"
              )
            );
        }
      }
    );

    return this.router;
  }
}

export default new LocationController();
