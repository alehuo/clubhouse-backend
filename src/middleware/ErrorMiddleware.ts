import { ErrorRequestHandler } from "express";
import { MessageFactory } from "../utils/MessageFactory";
import { StatusCode } from "../utils/StatusCodes";

export const ErrorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  return res
    .status(StatusCode.INTERNAL_SERVER_ERROR)
    .json(MessageFactory.createError("Internal server error", err));
};
