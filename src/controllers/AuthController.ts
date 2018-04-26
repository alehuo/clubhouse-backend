import * as express from "express";
import * as bcrypt from "bcrypt";
import IUser from "../models/IUser";

import Controller from "./Controller";
import UserDao from "../dao/UserDao";
import { JwtMiddleware, SignToken } from "../JwtUtils";

import MessageFactory from "./../MessageFactory";

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
          if (!(authData.username && authData.password)) {
            return res
              .status(500)
              .json(
                MessageFactory.createError("Missing request body parameters")
              );
          } else {
            const user: IUser | undefined = await this.userDao.findByUsername(
              authData.username
            );

            if (!user) {
              return res
                .status(400)
                .json(
                  MessageFactory.createError("Invalid username or password")
                );
            } else {
              // User exists, check for pash
              const dbPwd: string = user.password;
              const inputPwd: string = authData.password;

              try {
                const match: boolean = await bcrypt.compare(inputPwd, dbPwd);
                if (match) {
                  const token = SignToken({
                    username: user.username,
                    userId: user.userId,
                    unionId: user.unionId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    permissions: user.permissions
                  });
                  return res.status(200).json(Object.assign({}, { token }));
                } else {
                  return res
                    .status(400)
                    .json(
                      MessageFactory.createError("Invalid username or password")
                    );
                }
              } catch (ex) {
                console.error(ex);
                return res
                  .status(500)
                  .json(MessageFactory.createError("Internal server error"));
              }
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

    return this.router;
  }
}
