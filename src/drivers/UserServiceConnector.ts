import { generateServiceToken } from './TokenManager';
import { request } from 'https';
import { ResourceErrorReason, ResourceError } from '../errors';
import { reportError } from './SentryConnector';
import { USER_SERVICE_ROUTES } from '../routes';

export async function getUser(learningObjectId: string) {
    try {
        this.options.uri = USER_SERVICE_ROUTES.GET_USER(
            learningObjectId,
        );
        this.options.headers.Authorization = `Bearer ${generateServiceToken()}`;
        return request(this.options);
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ResourceError(
                'Could not fetch User',
                ResourceErrorReason.NOT_FOUND,
            ),
        );
    }
}
