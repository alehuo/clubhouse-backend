interface IError {
  error: string;
  exception?: Error;
  errors?: string[];
}

interface IMessage {
  message: string;
}

const createError: (
  error: string,
  exception?: Error,
  errors?: string[]
) => IError = (error: string, exception?: Error, errors?: string[]): IError => {
  const errorObject: IError = {
    error,
    errors
  };

  if (process.env.NODE_ENV !== "production") {
    errorObject.exception = exception;
  }

  return errorObject;
};

const createMessage: (message: string) => IMessage = (
  message: string
): IMessage => {
  return {
    message
  };
};

export default {
  createError,
  createMessage
};
