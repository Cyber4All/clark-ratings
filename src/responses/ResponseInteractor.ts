import { ResourceError, ResourceErrorReason, ServiceError, ServiceErrorType } from '../errors';
import { reportError } from '../drivers/SentryConnector';
import { ResponseDataStore } from './interfaces/ResponseDataStore';
import { Response } from '../types/Response';
import { hasResponseUpdateDeleteAccess, hasResponseCreateAccess } from './ResponseAuthorization';
import { UserToken } from '../types/UserToken';

/**
 * Delete a response
 * @Authorization
 * *** Must be response author ***
 * @export
 * @param params
 * @property { ResponseDataStore } dataStore instance of ResponseDataStore
 * @property { string } responseId id of response being deleted
 *
 * @returns { Promise<void> }
 */
export async function deleteResponse(params: {
    dataStore: ResponseDataStore;
    responseId: string;
    user: UserToken;
}): Promise<void> {
    try {
        const hasAccess = hasResponseUpdateDeleteAccess({
            dataStore: params.dataStore,
            user: params.user,
            responseId: params.responseId,
        });
        if (hasAccess) {
            await params.dataStore.deleteResponse({
                responseId: params.responseId,
            });
        } else {
            return Promise.reject(
                new ResourceError(
                    'Invalid Access',
                    ResourceErrorReason.INVALID_ACCESS,
                ),
            );
        }
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ResourceError(
                'Could not fetch rating',
                ResourceErrorReason.NOT_FOUND,
            ),
        );
    }
}

/**
 * Fetch the reponse for a given rating
 * @export
 * @param params
 * @property { ResponseDataStore } dataStore instance of ResponseDataStore
 * @property { string } ratingId id of rating that the reponse is attached to
 *
 * @returns { Promise<void> }
 */
export async function getResponse(params: {
    dataStore: ResponseDataStore;
    ratingId: string;
}): Promise<Response> {
    try {
        const response = await params.dataStore.getResponse({
            ratingId: params.ratingId,
        });
        return response;
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ResourceError(
                'Could not fetch response',
                ResourceErrorReason.NOT_FOUND,
            ),
        );
    }
}

/**
 * Delete a response
 * @Authorization
 * *** Must be response author ***
 * @export
 * @param params
 * @property { ResponseDataStore } dataStore instance of ResponseDataStore
 * @property { string } responseId id of response being deleted
 *
 * @returns { Promise<void> }
 */
export async function updateResponse(params: {
    dataStore: ResponseDataStore;
    responseId: string;
    updates: Response;
    user: UserToken;
}): Promise<void> {
    try {
        const hasAccess = hasResponseUpdateDeleteAccess({
            dataStore: params.dataStore,
            user: params.user,
            responseId: params.responseId,
        });
        if (hasAccess) {
            await params.dataStore.updateResponse({
                responseId: params.responseId,
                updates: params.updates,
            });
        } else {
            return Promise.reject(
                new ResourceError(
                    'Invalid Access',
                    ResourceErrorReason.INVALID_ACCESS,
                ),
            );
        }
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ServiceError(ServiceErrorType.INTERNAL),
        );
    }
}

/**
 * Create a response
 * @Authorization
 * *** Must be learning object author or contributor ***
 * @export
 * @param params
 * @property { ResponseDataStore } dataStore instance of ResponseDataStore
 * @property { string } responseId id of response being deleted
 *
 * @returns { Promise<void> }
 */
export async function createResponse(params: {
    dataStore: ResponseDataStore;
    ratingId: string;
    response: Response;
    user: UserToken;
}): Promise<void> {
    try {
        const hasAccess = hasResponseCreateAccess({
            dataStore: params.dataStore,
            user: params.user,
            ratingId: params.ratingId,
        });
        if (hasAccess) {
            const responseUser = {
                username: params.user.username,
                name: params.user.name,
                email: params.user.email,
            };
            await params.dataStore.createResponse({
                ratingId: params.ratingId,
                response: params.response,
                user: responseUser,
            });
        } else {
            return Promise.reject(
                new ResourceError(
                    'Invalid Access',
                    ResourceErrorReason.INVALID_ACCESS,
                ),
            );
        }
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ServiceError(
                ServiceErrorType.INTERNAL,
            ),
        );
    }
}
