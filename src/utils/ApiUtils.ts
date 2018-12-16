import express from "express";

// Generates an API url. API version defaults to API_VERSION constant.
export const apiUrl = (path: string, apiVersion: string) =>
  "/api/" + apiVersion + "/" + path;

export const apiHeader = (apiVersion: string) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  res.setHeader("X-Route-API-Version", apiVersion);
  next();
};
