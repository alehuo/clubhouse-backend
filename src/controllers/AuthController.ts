import * as express from "express";
import * as bcrypt from "bcrypt";
import IUser from "../models/IUser";

import Controller from "./Controller";
import UserDao from "../dao/UserDao";
import { JwtMiddleware, SignToken } from "../JwtUtils";
import PermissionDao from "../dao/PermissionDao";
import IPermission, { userPermissionFilter } from "../models/IPermission";

export default class AuthController extends Controller {
  constructor(private userDao: UserDao, private permissionDao: PermissionDao) {
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
                  const permissions: IPermission[] = await this.permissionDao.findPermissionsByUserId(
                    user[0].userId
                  );
                  const token = SignToken(
                    Object.assign(
                      {},
                      {
                        username: user[0].username,
                        userId: user[0].userId,
                        unionId: user[0].unionId,
                        email: user[0].email,
                        firstName: user[0].firstName,
                        lastName: user[0].lastName
                      },
                      permissions.map(userPermissionFilter)[0]
                    )
                  );
                  return res.status(200).json(Object.assign({}, { token }));
                } else {
                  return res
                    .status(400)
                    .json({ error: "Invalid username or password" });
                }
              } catch (ex) {
                console.error(ex);
                return res.status(500).json({ error: "Internal server error" });
              }
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
