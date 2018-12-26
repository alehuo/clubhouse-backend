import { RequestHandler } from "express";

export const APIVersionMiddleware = (apiVersion: string): RequestHandler => (
  req,
  res,
  next
) => {
  res.setHeader("X-Latest-API-Version", apiVersion);
  next();
};
