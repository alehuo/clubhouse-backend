import { ApiError, ApiResponse } from "@alehuo/clubhouse-shared";

/**
 * Creates an API response.
 *
 * @export
 * @template T Type of the payload
 * @param {T} payload Payload
 * @param {boolean} [success=true] Was the request successful or not
 * @param {IError} [error] Error object
 * @returns {ApiResponse<T>} API response
 */
function createResponse<T>(
  success: boolean = true,
  message: string = "",
  payload?: T,
  error?: ApiError
): ApiResponse<T> {
  return {
    success,
    message,
    payload,
    error
  };
}

const createError = (error: string, exception?: Error, errors?: string[]) => {
  const errorObject: ApiError = {
    message: error,
    errors
  };

  if (process.env.NODE_ENV !== "production") {
    errorObject.exception = exception;
  }

  const apiResponse = createResponse<undefined>(
    false, // Unsuccessful
    error, // Empty message
    undefined, // Payload
    errorObject // Error object
  );

  return apiResponse;
};

const createMessage = (message: string) =>
  createResponse<undefined>(true, message);

const createModelValidationError = (model: string) =>
  createResponse<undefined>(
    false,
    "Model validation error: " +
      model +
      " returned from database is malformed.",
    undefined,
    {
      message:
        "Model validation error: " +
        model +
        " returned from database is malformed."
    }
  );

export const MessageFactory = {
  createError,
  createMessage,
  createResponse,
  createModelValidationError
};
