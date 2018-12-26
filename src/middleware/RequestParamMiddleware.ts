import { RequestHandler } from "express";
import { MessageFactory } from "../utils/MessageFactory";
import { StatusCode } from "../utils/StatusCodes";

/**
 * Request parameter middleware
 *
 * @export
 * @template T Model that will determine what request parameters are allowed
 * @param {...Array<keyof T>} params Fields that are required in the post body, defined by the model T
 * @returns Express middleware function
 */
export function RequestParamMiddleware<T>(
  ...params: Array<keyof T>
): RequestHandler {
  return (req, res, next) => {
    const missing: Array<keyof T> = [];
    for (const param of params) {
      if (!req.body.hasOwnProperty(param)) {
        missing.push(param);
      }
    }
    if (missing.length > 0) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json(
          MessageFactory.createError(
            "Missing request body parameters",
            undefined,
            ["Missing: " + missing.sort().join(", ")]
          )
        );
    }
    next();
  };
}
