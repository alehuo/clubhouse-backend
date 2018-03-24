import * as express from "express";
import * as bcrypt from "bcrypt";
import IUser from "../models/IUser";

import Controller from "./Controller";
import UserDao from "../dao/UserDao";
import { JwtMiddleware } from "../JwtUtils";

export default class AuthController extends Controller {
  constructor(private userDao: UserDao) {
    super();
  }

  public routes(): express.Router {
    this.router.post(
      "",
      async (req: express.Request, res: express.Response) => {
        try {
          const authData: {
            username: string;
            password: string;
          } =
            req.body;
          console.log(req.body);
          if (!(authData.username && authData.password)) {
            return res
              .status(500)
              .json({ error: "Missing request body parameters" });
          } else {
            const user: IUser[] | undefined = await this.userDao.findByUsername(
              authData.username
            );

            if (!(user && user.length > 0)) {
              return res
                .status(400)
                .json({ error: "Invalid username or password" });
            } else {
              // User exists, check for pash
              const dbPwd: string = user[0].password;
              const inputPwd: string = authData.password;

              try {
                const match: boolean = await bcrypt.compare(inputPwd, dbPwd);
                if (match) {
                  return res.status(200).json({ token: "abcd" });
                } else {
                  return res
                    .status(400)
                    .json({ error: "Invalid username or password" });
                }
              } catch (ex) {
                return res
                  .status(400)
                  .json({ error: "Invalid username or password" });
              }

              return res.status(201).json(Object.assign({}, authData));
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
