const createError = (error: string, errors?: string[]) => {
  return {
    error,
    errors
  };
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
