import * as express from "express";
import * as bcrypt from "bcrypt";
import ILocation, { locationFilter } from "../models/ILocation";

import Controller from "./Controller";
import JwtMiddleware from "./../middleware/JwtMiddleware";
import LocationDao from "../dao/LocationDao";
import MessageFactory from "../Utils/MessageFactory";
import { PermissionMiddleware } from "../Middleware/PermissionMiddleware";
import { getPermission, permissionNames } from "../utils/PermissionUtils";

export default class LocationController extends Controller {
  constructor(private locationDao: LocationDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const result: ILocation[] = await this.locationDao.findAll();
          return res.json(result.map(locationFilter));
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    this.router.get(
      "/:locationId(\\d+)",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
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
      }
    );

    this.router.post(
      "",
      JwtMiddleware,
      PermissionMiddleware([getPermission(permissionNames.ADD_LOCATION)]),
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
          console.error(err);
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    this.router.delete(
      "/:locationId(\\d+)",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
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
              .json(MessageFactory.createMessage("Failed to remove location"));
          }
        } else {
          return res
            .status(404)
            .json(MessageFactory.createError("Location not found"));
        }
      }
    );

    return this.router;
  }
}
