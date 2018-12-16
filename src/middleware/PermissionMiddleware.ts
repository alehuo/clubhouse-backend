import * as express from "express";
import { MessageFactory } from "../utils/MessageFactory";
import { hasPermissions } from "../utils/PermissionUtils";

export const PermissionMiddleware = (...requiredPermissions: number[]) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Handle required permissions here.
  const token = res.locals.token;
  if (token) {
    const userPerms: number = token.data.permissions;
    if (
      requiredPermissions.every((permission) =>
        hasPermissions(userPerms, permission)
      )
    ) {
      next();
    } else {
      return res.status(400).json(MessageFactory.createError("Unauthorized"));
    }
  } else {
    return res.status(400).json(MessageFactory.createError("Invalid token"));
  }
};
