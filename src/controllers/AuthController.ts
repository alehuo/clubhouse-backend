import * as bcrypt from "bcrypt";
import * as express from "express";
import { IUser } from "../models/IUser";

import UserDao from "../dao/UserDao";
import { SignToken } from "../utils/JwtUtils";
import Controller from "./Controller";

import { MessageFactory } from "../utils/MessageFactory";

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
            email: string;
            password: string;
          } = req.body;
          if (!(authData.email && authData.password)) {
            return res
              .status(400)
              .json(
                MessageFactory.createError("Missing request body parameters")
              );
          } else {
            const user: IUser = await this.userDao.findByEmail(authData.email);

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
                  const token: string = SignToken({
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
                return res
                  .status(500)
                  .json(
                    MessageFactory.createError(
                      "Internal server error: Cannot authenticate user",
                      ex as Error
                    )
                  );
              }
            }
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot authenticate user",
                err as Error
              )
            );
        }
      }
    );

    return this.router;
  }
}
