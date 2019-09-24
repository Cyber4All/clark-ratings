import { LEARNING_OBJECT_SERVICE_ROUTES } from '../routes';
import { generateServiceToken } from './TokenManager';
import * as request from 'request-promise';
import { ServiceError, ServiceErrorReason } from '../errors';
import { reportError } from './SentryConnector';

export async function getLearningObject(params: {
    CUID: string;
    versionID: string;
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
        versionID: params.versionID,
    });
    options.headers.Authorization = `Bearer ${generateServiceToken()}`;
    return request(options);
}
