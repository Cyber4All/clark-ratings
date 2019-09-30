export const LEARNING_OBJECT_SERVICE_ROUTES = {
  GET_LEARNING_OBJECT(params: {
    CUID: string;
    version: string;
    username: string;
  }): string {
    return `${
      process.env.LEARNING_OBJECT_SERVICE_URI
    }/users/${
      encodeURIComponent(params.username)
    }/learning-objects/${
      encodeURIComponent(params.CUID)
    }?version=${
      encodeURIComponent(params.version)
    }`;
  },
};

export const USER_SERVICE_ROUTES = {
  GET_USER(params: {
    userId: string;
  }) {
    return `${
      process.env.USER_SERVICE_URI
    }/users/update?username=${encodeURIComponent(
      params.userId,
    )}`;
  },
};
