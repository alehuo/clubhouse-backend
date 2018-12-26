import { RequestHandler } from "express";
import { VerifyToken } from "../utils/JwtUtils";
import { MessageFactory } from "../utils/MessageFactory";
import { StatusCode } from "../utils/StatusCodes";

export const JWTMiddleware: RequestHandler = async (req, res, next) => {
  // Extract auth header
  const authHeader = req.get("Authorization");
  if (authHeader === undefined) {
    // If the token is undefined, return an error.
    return res
      .status(StatusCode.BAD_REQUEST)
      .json(MessageFactory.createError("Missing Authorization header"));
  }
  // Split header into parts to extract token & check for Bearer
  const headerParts = authHeader.split(" ");
  if (headerParts.length === 2 && headerParts[0] === "Bearer") {
    try {
      // Verify the token.
      const token = VerifyToken(headerParts[1]);
      // Everything is ok. Set the JWT and pass it forwards.
      res.locals.token = token;
      next();
    } catch (ex) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json(MessageFactory.createError("Malformed Authorization header"));
    }
  } else {
    return res
      .status(StatusCode.BAD_REQUEST)
      .json(MessageFactory.createError("Malformed Authorization header"));
  }
};
