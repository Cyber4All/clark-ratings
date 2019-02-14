import { LEARNING_OBJECT_SERVICE_ROUTES } from '../routes';
import { generateServiceToken } from './TokenManager';
import { request } from 'https';
import { ResourceError, ResourceErrorReason } from '../errors';
import { reportError } from './SentryConnector';

export async function getLearningObject(learningObjectId: string) {
    try {
        this.options.uri = LEARNING_OBJECT_SERVICE_ROUTES.GET_LEARNING_OBJECT(
            learningObjectId,
        );
        this.options.headers.Authorization = `Bearer ${generateServiceToken()}`;
        return request(this.options);
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ResourceError(
                'Could not fetch Learning Object',
                ResourceErrorReason.NOT_FOUND,
            ),
        );
    }
}
