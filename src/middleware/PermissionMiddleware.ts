import { Permission } from "@alehuo/clubhouse-shared";
import * as express from "express";
import { MessageFactory } from "../utils/MessageFactory";
import { hasPermissions } from "../utils/PermissionUtils";

/**
 * Permission middleware.
 * @param req Express request.
 * @param res Express response.
 * @param next Express NextFunction
 */
export const PermissionMiddleware: any = (
  ...requiredPermissions: Permission[]
) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Handle required permissions here.
  const token: any = res.locals.token;
  if (token) {
    // const userData: object = token.data;
    const userPerms: number = token.data.permissions;
    if (hasPermissions(userPerms, requiredPermissions)) {
      next();
    } else {
      return res.status(400).json(MessageFactory.createError("Unauthorized"));
    }
  } else {
    return res.status(400).json(MessageFactory.createError("Invalid token"));
  }
};
