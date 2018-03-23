import * as express from "express";
import * as jwt from "jsonwebtoken";

/**
 * Express middleware for verifying JWT's.
 * @param req Express request.
 * @param res Express response.
 * @param next Express NextFunction
 */
export const JwtMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Extract auth header
  const authHeader: string = req.get("Authorization");
  if (authHeader === undefined) {
    // If the token is undefined, return an error.
    return res.status(403).json({ error: "Missing Authorization header" });
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
      console.error(ex);
      return res.status(403).json({ error: "Malformed Authorization header" });
    }
  } else {
    return res.status(403).json({ error: "Malformed Authorization header" });
  }
};

/**
 * Signs and returns a JWT.
 * @param data Data.
 */
export const SignToken = (data: string | object | Buffer): string =>
  jwt.sign({ exp: process.env.JWT_EXPIRE, data }, process.env.JWT_SECRET, {
    algorithm: "HS256"
  });

/**
 * Verifies the JWT.
 * @param token Decoded JWT.
 */
export const VerifyToken = (token: string, secret: string | Buffer = process.env.JWT_SECRET): string | object  => {
  try {
    return jwt.verify(token, secret);
  } catch (ex) {
    throw new Error(ex);
  }
};
