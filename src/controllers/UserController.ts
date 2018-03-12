import * as express from "express";
import IUser from "../models/IUser";

import Controller from "./Controller";
import UserDao from "../repository/UserDao";

export default class UserController extends Controller {
  constructor(private userDao: UserDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", async (req: express.Request, res: express.Response) => {
      const result: IUser[] = await this.userDao.findAll();
      return res.json(result);
    });

    return this.router;
  }
}
