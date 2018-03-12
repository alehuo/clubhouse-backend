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
      const result: IImage[] = await this.imageDao.findAll();
      return res.json(result);
    });

    return this.router;
  }
}
