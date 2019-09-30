import { LEARNING_OBJECT_SERVICE_ROUTES } from '../routes';
import { generateServiceToken } from './TokenManager';
import * as request from 'request-promise';

export async function getLearningObject(params: {
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
    options.headers.Authorization = `Bearer ${generateServiceToken()}`;
    return request(options);
}
