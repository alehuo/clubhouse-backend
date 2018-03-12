import * as express from "express";
import IImageData from "../models/ImageData";

import connect from "./../Database";
import Controller from "./Controller";
import ImageDataDao from "../repository/ImageDataDao";

class ImageDataController extends Controller {
  constructor(private imageDataDao: ImageDataDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", async (req: express.Request, res: express.Response) => {
      const result: IImageData[] = await this.imageDataDao.findAll();
      return res.json(result);
    });

    return this.router;
  }
}

export default new ImageDataController(new ImageDataDao()).routes();
