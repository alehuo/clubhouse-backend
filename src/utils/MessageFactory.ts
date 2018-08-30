export interface IError {
  error: string;
  exception?: Error;
  errors?: string[];
}

export interface IMessage {
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

interface MsgFactory {
  createError: (error: string, exception?: Error, errors?: string[]) => IError;
  createMessage: (message: string) => IMessage;
}

export const MessageFactory: MsgFactory = {
  createError,
  createMessage
};
