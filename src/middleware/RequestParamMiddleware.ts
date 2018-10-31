import * as express from "express";
import { MessageFactory } from "../utils/MessageFactory";

export const RequestParamMiddleware: any = (...params: string[]) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const missing: string[] = [];
  for (const param of params) {
    if (!req.body.hasOwnProperty(param)) {
      missing.push(param);
    }
  }
  if (missing.length > 0) {
    return res
      .status(400)
      .json(
        MessageFactory.createError("Missing request body parameters", undefined, [
          "Missing: " + missing.sort().join(", ")
        ])
      );
  }
  next();
};
