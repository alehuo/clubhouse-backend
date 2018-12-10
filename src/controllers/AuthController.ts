import bcrypt from "bcrypt";
import express from "express";
import UserDao from "../dao/UserDao";
import { SignToken } from "../utils/JwtUtils";
import Controller from "./Controller";

import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { MessageFactory } from "../utils/MessageFactory";

export default class AuthController extends Controller {
  constructor(private userDao: UserDao) {
    super();
  }

  public routes(): express.Router {
    this.router.post(
      "",
      RequestParamMiddleware("email", "password"),
      async (req: express.Request, res: express.Response) => {
        try {
          const authData: {
            email: string;
            password: string;
          } = req.body;

          const user = await this.userDao.findByEmail(authData.email);

          if (!user) {
            return res
              .status(400)
              .json(MessageFactory.createError("Invalid username or password"));
          } else {
            // User exists, check for pash
            const dbPwd = user.password;
            const inputPwd = authData.password;

            try {
              const match = await bcrypt.compare(inputPwd, dbPwd);
              if (match) {
                const token = SignToken({
                  userId: user.userId,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  permissions: user.permissions
                });
                return res.status(200).json({ ...{ token } });
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
