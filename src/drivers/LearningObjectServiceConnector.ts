import { LEARNING_OBJECT_SERVICE_ROUTES } from '../routes';
import { generateServiceToken } from './TokenManager';
import * as request from 'request-promise';
import { ResourceError, ResourceErrorReason } from '../errors';
import { reportError } from './SentryConnector';

export async function getLearningObject(params: {
    learningObjectId: string;
}) {
    try {
        const options = {
            uri: '',
            json: true,
            headers: {
              Authorization: 'Bearer',
            },
            method: 'GET',
        };
        options.uri = LEARNING_OBJECT_SERVICE_ROUTES.GET_LEARNING_OBJECT({
            learningObjectId: params.learningObjectId,
        });
        options.headers.Authorization = `Bearer ${generateServiceToken()}`;
        return request(options);
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
