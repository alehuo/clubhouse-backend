import express from "express";

// Generates an API url. API version defaults to API_VERSION constant.
export const apiUrl = (path: string, apiVersion: string) =>
  "/api/" + apiVersion + "/" + path;

export const apiHeader = (apiVersion: string): express.RequestHandler => (
  req,
  res,
  next
) => {
  res.setHeader("X-Route-API-Version", apiVersion);
  next();
};
