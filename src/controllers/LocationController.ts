import express from "express";
import { locationFilter } from "../models/ILocation";

import LocationDao from "../dao/LocationDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import Controller from "./Controller";

import { Permissions } from "@alehuo/clubhouse-shared";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";

export default class LocationController extends Controller {
  constructor(private locationDao: LocationDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_VIEW_LOCATIONS),
      async (req: express.Request, res: express.Response) => {
        try {
          const result = await this.locationDao.findAll();
          return res.json(result.map(locationFilter));
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get all locations",
                err as Error
              )
            );
        }
      }
    );

    this.router.get(
      "/:locationId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_VIEW_LOCATIONS),
      async (req: express.Request, res: express.Response) => {
        try {
          const location = await this.locationDao.findOne(
            req.params.locationId
          );
          if (location) {
            return res.status(200).json(locationFilter(location));
          } else {
            return res
              .status(404)
              .json(MessageFactory.createError("Location not found"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get a single location"
              )
            );
        }
      }
    );

    this.router.post(
      "",
      RequestParamMiddleware("name", "address"),
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_ADD_EDIT_REMOVE_LOCATIONS),
      async (req: express.Request, res: express.Response) => {
        try {
          const { name, address } = req.body;
          const location = await this.locationDao.findByName(name);
          if (location) {
            return res
              .status(400)
              .json(MessageFactory.createError("Location already exists"));
          } else {
            const locationObj = {
              name: name.trim(),
              address: address.trim()
            };
            const savedLocation = await this.locationDao.save(locationObj);

            return res.status(201).json({
              ...locationObj,
              ...{
                locationId: savedLocation[0]
              }
            });
          }
        } catch (err) {
          return res
            .status(500)
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
      PermissionMiddleware(Permissions.ALLOW_ADD_EDIT_REMOVE_LOCATIONS),
      async (req: express.Request, res: express.Response) => {
        try {
          const locations = await this.locationDao.findOne(
            req.params.locationId
          );
          if (locations) {
            const result = await this.locationDao.remove(req.params.locationId);
            if (result) {
              return res
                .status(200)
                .json(MessageFactory.createMessage("Location removed"));
            } else {
              return res
                .status(400)
                .json(
                  MessageFactory.createMessage("Failed to remove location")
                );
            }
          } else {
            return res
              .status(404)
              .json(MessageFactory.createError("Location not found"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot delete a location"
              )
            );
        }
      }
    );

    return this.router;
  }
}
