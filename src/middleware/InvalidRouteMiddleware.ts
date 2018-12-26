import { RequestHandler } from "express";
import { MessageFactory } from "../utils/MessageFactory";
import { StatusCode } from "../utils/StatusCodes";

export const InvalidRouteMiddleware: RequestHandler = (req, res, next) =>
  res
    .status(StatusCode.NOT_FOUND)
    .json(MessageFactory.createError("Invalid API route"));
