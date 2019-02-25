import { generateServiceToken } from './TokenManager';
import { request } from 'https';
import { ServiceError, ServiceErrorReason } from '../errors';
import { reportError } from './SentryConnector';
import { USER_SERVICE_ROUTES } from '../routes';

export async function getUser(params: {
    userId: string;
}) {
    try {
        this.options.uri = USER_SERVICE_ROUTES.GET_USER({
            userId: params.userId,
        });
        this.options.headers.Authorization = `Bearer ${generateServiceToken()}`;
        return request(this.options);
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ServiceError(
                ServiceErrorReason.INTERNAL,
            ),
        );
    }
}
