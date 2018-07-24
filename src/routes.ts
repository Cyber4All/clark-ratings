export const LEARNING_OBJECT_SERVICE_ROUTES = {
    GET_ID(author: string, objectName: string) {
      return `${
        process.env.LEARNING_OBJECT_SERVICE_URI
      }/learning-objects/${encodeURIComponent(author)}/${encodeURIComponent(
        objectName
      )}/id`;
    }
};