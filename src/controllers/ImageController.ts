import * as express from "express";
import IImage from "../models/Image";

import Controller from "./Controller";
import ImageDao from "../repository/ImageDao";

export default class ImageController extends Controller {
  constructor(private imageDao: ImageDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", async (req: express.Request, res: express.Response) => {
      try {
        const result: IImage[] = await this.imageDao.findAll();
        return res.json(result);
      } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    return this.router;
  }
}
