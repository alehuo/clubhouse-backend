import * as express from "express";
import * as jwt from "jsonwebtoken";

export const JwtMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader: string = req.get("Authorization");
  if (authHeader === undefined) {
    return res.status(403).json({ error: "Missing Authorization header" });
  }
  const headerParts: string[] = authHeader.split(" ");
  if (headerParts.length === 2 && headerParts[0] === "Bearer") {
    try {
      const token: string | object = jwt.verify(
        headerParts[1],
        process.env.JWT_SECRET
      );
      console.dir(token);
      // Authenticate the user
      next();
    } catch (ex) {
      console.error("Error: %s", ex.message);
      return res.status(403).json({ error: "Malformed Authorization header" });
    }
  } else {
    return res.status(403).json({ error: "Malformed Authorization header" });
  }
};

export const SignToken = data => data;
export const VerifyToken = data => data;
