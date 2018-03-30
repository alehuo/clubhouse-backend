import * as express from "express";
import * as bcrypt from "bcrypt";
import ILocation, { locationFilter } from "../models/ILocation";

import Controller from "./Controller";
import { JwtMiddleware } from "../JwtUtils";
import LocationDao from "../dao/LocationDao";

export default class LocationController extends Controller {
  constructor(private locationDao: LocationDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", async (req: express.Request, res: express.Response) => {
      try {
        const result: ILocation[] = await this.locationDao.findAll();
        return res.json(result.map(locationFilter));
      } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    this.router.get(
      "/:locationId",
      async (req: express.Request, res: express.Response) => {
        const locations: any = await this.locationDao.findOne(
          req.params.locationId
        );
        if (locations && locations.length === 1) {
          return res.status(200).json(locationFilter(locations[0]));
        } else {
          return res.status(404).json({ error: "Location union not found" });
        }
      }
    );

    this.router.post(
      "",
      async (req: express.Request, res: express.Response) => {
        try {
          const locationData: ILocation = req.body;
          if (!(locationData.name && locationData.address)) {
            return res
              .status(500)
              .json({ error: "Missing request body parameters" });
          } else {
            const location:
              | ILocation[]
              | undefined = await this.locationDao.findByName(
              locationData.name
            );

            if (location && location.length > 0) {
              return res.status(400).json({ error: "User already exists" });
            } else {
              const savedLocation = await this.locationDao.save({
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
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );

    return this.router;
  }
}
