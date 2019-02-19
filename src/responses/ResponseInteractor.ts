import { ResourceError, ResourceErrorReason, ServiceError, ServiceErrorType } from '../errors';
import { reportError } from '../drivers/SentryConnector';
import { ResponseDataStore } from './interfaces/ResponseDataStore';
import { Response } from '../types/Response';


/**
 * Delete a response
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
}): Promise<void> {
    try {
        await params.dataStore.deleteResponse({
            responseId: params.responseId,
        });
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
}): Promise<void> {
    try {
        await params.dataStore.updateResponse({
            responseId: params.responseId,
            updates: params.updates,
        });
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ServiceError(ServiceErrorType.INTERNAL),
        );
    }
}

/**
 * Create a response
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
    username: string;
    name: string;
    email: string;
}): Promise<void> {
    try {
        await params.dataStore.createResponse({
            ratingId: params.ratingId,
            response: params.response,
            username: params.username,
            name: params.name,
            email: params.email,
        });
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ServiceError(
                ServiceErrorType.INTERNAL,
            ),
        );
    }
}
