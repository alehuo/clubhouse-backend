import * as express from "express";
import IFolder from "../models/Folder";

import connect from "./../Database";
import Controller from "./Controller";
import FolderDao from "../repository/FolderDao";

class FolderController extends Controller {
  constructor(private folderDao: FolderDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", async (req: express.Request, res: express.Response) => {
      const result: IFolder[] = await this.folderDao.findAll();
      return res.json(result);
    });

    return this.router;
  }
}

export default new FolderController(new FolderDao()).routes();
