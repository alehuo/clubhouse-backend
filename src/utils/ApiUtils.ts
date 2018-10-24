import express from "express";

// Generates an API url. API version defaults to API_VERSION constant.
export const apiUrl: (path: string, apiVersion: string) => string = (
  path: string,
  apiVersion: string
): string => "/api/" + apiVersion + "/" + path;

export const apiHeader: (
  path: string,
  apiVersion: string
) => express.RequestHandler = (path: string, apiVersion: string): any => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  res.setHeader("X-Route-API-Version", apiVersion);
  next();
};
