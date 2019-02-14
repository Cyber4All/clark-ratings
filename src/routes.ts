export const LEARNING_OBJECT_SERVICE_ROUTES = {
    GET_LEARNING_OBJECT(learningObjectId: string) {
      return `${
        process.env.LEARNING_OBJECT_SERVICE_URI
      }/learning-objects/${encodeURIComponent(learningObjectId)}`;
    },
};

export const USER_SERVICE_ROUTES = {
  GET_USER(author: string) {
    return `${
      process.env.USER_SERVICE_URI
    }/users/update?username=${encodeURIComponent(
      author,
    )}`;
  },
};
