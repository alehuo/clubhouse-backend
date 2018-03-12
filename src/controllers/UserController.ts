import * as express from "express";
import IUser, { userFilter } from "../models/IUser";

import Controller from "./Controller";
import UserDao from "../repository/UserDao";

export default class UserController extends Controller {
  constructor(private userDao: UserDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", async (req: express.Request, res: express.Response) => {
      try {
        const result: IUser[] = await this.userDao.findAll();
        return res.json(result.map(userFilter));
      } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    return this.router;
  }
}
