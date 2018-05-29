import * as express from "express";
import * as bcrypt from "bcrypt";
import ILocation, { locationFilter } from "../models/ILocation";

import Controller from "./Controller";
import JwtMiddleware from "./../middleware/JwtMiddleware";
import LocationDao from "../dao/LocationDao";
import MessageFactory from "../Utils/MessageFactory";

import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import permissions = require("./../Permissions");

export default class LocationController extends Controller {
  constructor(private locationDao: LocationDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_VIEW_LOCATIONS]),
      async (req: express.Request, res: express.Response) => {
        try {
          const result: ILocation[] = await this.locationDao.findAll();
          return res.json(result.map(locationFilter));
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get all posts"
              )
            );
        }
      }
    );

    this.router.get(
      "/:locationId(\\d+)",
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_VIEW_LOCATIONS]),
      async (req: express.Request, res: express.Response) => {
        try {
          const location: ILocation = await this.locationDao.findOne(
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
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_ADD_LOCATION]),
      async (req: express.Request, res: express.Response) => {
        try {
          const locationData: ILocation = req.body;
          if (!(locationData.name && locationData.address)) {
            return res
              .status(500)
              .json(
                MessageFactory.createError("Missing request body parameters")
              );
          } else {
            const location: ILocation = await this.locationDao.findByName(
              locationData.name
            );

            if (location) {
              return res
                .status(400)
                .json(MessageFactory.createError("Location already exists"));
            } else {
              const savedLocation: number[] = await this.locationDao.save({
                name: locationData.name,
                address: locationData.address
              });

              return res.status(201).json(
                Object.assign({}, locationData, {
                  locationId: savedLocation[0]
                })
              );
            }
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
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_DELETE_LOCATION]),
      async (req: express.Request, res: express.Response) => {
        try {
          const locations: any = await this.locationDao.findOne(
            req.params.locationId
          );
          if (locations && locations.length === 1) {
            const result: boolean = await this.locationDao.remove(
              req.params.locationId
            );
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
