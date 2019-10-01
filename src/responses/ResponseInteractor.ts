import { ResourceError, ResourceErrorReason } from '../errors';
import { Response } from '../types/Response';
import { hasResponseUpdateDeleteAccess, hasResponseCreateAccess } from './ResponseAuthorization';
import { UserToken } from '../types/UserToken';
import { ResponseStore } from './ResponseStore';

/**
 * Delete a response
 * @Authorization
 * *** Must be response author ***
 * @export
 * @param params
 * @property { ResponseDataStore } dataStore instance of ResponseDataStore
 * @property { string } responseID ID of response being deleted
 *
 * @returns { Promise<voID> }
 */
export async function deleteResponse(params: {
    responseID: string;
    user: UserToken;
}): Promise<void> {
    const hasAccess = await hasResponseUpdateDeleteAccess({
        dataStore: getDataStore(),
        user: params.user,
        responseID: params.responseID,
    });
    if (!hasAccess) {
        throw new ResourceError(
            'Invalid Access',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }
    await getDataStore().deleteResponse({
        responseID: params.responseID,
    });
}

/**
 * Fetch the reponse for a given rating
 * @export
 * @param params
 * @property { ResponseDataStore } dataStore instance of ResponseDataStore
 * @property { string } ratingID ID of rating that the reponse is attached to
 *
 * @returns { Promise<voID> }
 */
export async function getResponses(params: {
    ratingIDs: string[];
}): Promise<Response[]> {
    const responses = await getDataStore().getResponses({
        ratingIDs: params.ratingIDs,
    });
    return responses;
}

/**
 * Update a response
 * @Authorization
 * *** Must be response author ***
 * @export
 * @param params
 * @property { ResponseDataStore } dataStore instance of ResponseDataStore
 * @property { string } responseID ID of response being deleted
 *
 * @returns { Promise<voID> }
 */
export async function updateResponse(params: {
    responseID: string;
    updates: Response;
    user: UserToken;
}): Promise<void> {
    const hasAccess = await hasResponseUpdateDeleteAccess({
        dataStore: getDataStore(),
        user: params.user,
        responseID: params.responseID,
    });
    if (!hasAccess) {
        throw new ResourceError(
            'InvalID Access',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }
    await getDataStore().updateResponse({
        responseID: params.responseID,
        updates: params.updates,
    });
}

/**
 * Create a response
 * @Authorization
 * *** Must be learning object author or contributor, Learning Object must not have a response already***
 * @export
 * @param params
 * @property { ResponseDataStore } dataStore instance of ResponseDataStore
 * @property { string } responseID ID of response being deleted
 *
 * @returns { Promise<voID> }
 */
export async function createResponse(params: {
    username: string;
    ratingID: string;
    response: Response;
    user: UserToken;
}): Promise<void> {
    const hasAccess = await hasResponseCreateAccess({
        username: params.username,
        dataStore: getDataStore(),
        user: params.user,
        ratingID: params.ratingID,
    });
    if (!hasAccess) {
        throw new ResourceError(
            'Invalid Access',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }
    const responseUser = {
        username: params.user.username,
        name: params.user.name,
        email: params.user.email,
    };
    await getDataStore().createResponse({
        ratingID: params.ratingID,
        response: params.response,
        user: responseUser,
    });
}

function getDataStore() {
    return ResponseStore.getInstance();
}
