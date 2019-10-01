import { LEARNING_OBJECT_SERVICE_ROUTES } from '../routes';
import { generateUserToken } from './TokenManager';
import * as request from 'request-promise';
import { reportError } from './SentryConnector';
import { UserToken } from '../types/UserToken';

export async function getLearningObject(params: {
    user: UserToken;
    CUID: string;
    version: string;
    username: string;
}) {
    const options = {
        uri: '',
        json: true,
        headers: {
            Authorization: 'Bearer',
        },
        method: 'GET',
    };
    options.uri = LEARNING_OBJECT_SERVICE_ROUTES.GET_LEARNING_OBJECT({
        CUID: params.CUID,
        version: params.version,
        username: params.username,
    });
    if (params.user) {
        options.headers.Authorization = `Bearer ${generateUserToken(params.user)}`;
    }
    try {
        const response = await request(options);
        return response[0];
    } catch (error) {
        // If the response has a status code of 500 or above
        // report the error to Sentry. Reporting the error from here
        // allows us to see more error context before translating
        // it to a known service error.
        if (error.status >= 500) {
            reportError(error);
        }
    }
}
