import * as express from "express";
import { VerifyToken } from "../utils/JwtUtils";
import { MessageFactory } from "../utils/MessageFactory";
/**
 * Express middleware for verifying JWT's.
 * @param req Express request.
 * @param res Express response.
 * @param next Express NextFunction
 */
export const JWTMiddleware: any = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Extract auth header
  const authHeader: string | undefined = req.get("Authorization");
  if (authHeader === undefined) {
    // If the token is undefined, return an error.
    return res
      .status(403)
      .json(MessageFactory.createError("Missing Authorization header"));
  }
  // Split header into parts to extract token & check for Bearer
  const headerParts: string[] = authHeader.split(" ");
  if (headerParts.length === 2 && headerParts[0] === "Bearer") {
    try {
      // Verify the token.
      const token: string | object = VerifyToken(headerParts[1]);
      // Everything is ok. Set the JWT and pass it forwards.
      res.locals.token = token;
      next();
    } catch (ex) {
      return res
        .status(403)
        .json(MessageFactory.createError("Malformed Authorization header"));
    }
  } else {
    return res
      .status(403)
      .json(MessageFactory.createError("Malformed Authorization header"));
  }
};
