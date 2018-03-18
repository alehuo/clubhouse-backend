import * as express from "express";
import * as bcrypt from "bcrypt";
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

    this.router.post(
      "",
      async (req: express.Request, res: express.Response) => {
        try {
          const userData: {
            username: string;
            email: string;
            password: string;
          } =
            req.body;
          if (!(userData.username && userData.email && userData.password)) {
            return res
              .status(500)
              .json({ error: "Missing request body parameters" });
          } else {
            // TODO: Save user
            const user: IUser[] | undefined = await this.userDao.findByUsername(
              userData.username
            );

            if (user && user.length > 0) {
              return res.status(400).json({ error: "User already exists" });
            } else {
              if (userData.password.length < 8) {
                return res.status(400).json({ error: "Password is too short" });
              }

              const savedUser = await this.userDao.save({
                username: userData.username,
                email: userData.email,
                password: userData.password
              });

              return res
                .status(201)
                .json(Object.assign({}, userData, { userId: savedUser[0] }));
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
