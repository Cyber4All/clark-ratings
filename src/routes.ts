export const LEARNING_OBJECT_SERVICE_ROUTES = {
    GET_ID(author: string, objectName: string) {
      return `${
        process.env.LEARNING_OBJECT_SERVICE_URI
      }/learning-objects/${encodeURIComponent(author)}/${encodeURIComponent(
        objectName
      )}/id`;
    }
};

export const USER_SERVICE_ROUTES = {
  GET_ID(author: string) {
    return `${
      process.env.USER_SERVICE_URI
    }/users/update?username=${encodeURIComponent(
      author
    )}`;
  }
};
