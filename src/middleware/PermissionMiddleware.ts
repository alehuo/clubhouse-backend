import { RequestHandler } from "express";
import { MessageFactory } from "../utils/MessageFactory";
import { hasPermissions } from "../utils/PermissionUtils";
import { StatusCode } from "../utils/StatusCodes";

export const PermissionMiddleware = (
  ...requiredPermissions: number[]
): RequestHandler => (req, res, next) => {
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
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json(MessageFactory.createError("Unauthorized"));
    }
  } else {
    return res
      .status(StatusCode.BAD_REQUEST)
      .json(MessageFactory.createError("Invalid token"));
  }
};
