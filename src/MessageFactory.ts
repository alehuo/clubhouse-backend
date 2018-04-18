const createError = (error: string) => {
  return {
    error
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
