import * as Sentry from '@sentry/node';

export const reportError = (error: Error) => {
  Sentry.captureException(error);
};
