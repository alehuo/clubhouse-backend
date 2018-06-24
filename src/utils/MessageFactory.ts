interface IError {
  error: string;
  exception?: Error;
  errors?: string[];
}

const createError = (
  error: string,
  exception?: Error,
  errors?: string[]
): IError => {
  const errorObject: IError = {
    error,
    errors
  };

  if (process.env.NODE_ENV !== "production") {
    errorObject.exception = exception;
  }

  return errorObject;
};

const createMessage = (message: string) => {
  return {
    message
  };
};

export default {
  createError,
  createMessage
};
