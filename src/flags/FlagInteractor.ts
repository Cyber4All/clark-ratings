import { Flag } from '../types/Flag';
import { FlagDataStore } from './interfaces/FlagDataStore';
import { UserToken } from '../types/UserToken';
import { hasFlagCreateAccess, hasPrivilegedAccess } from './FlagAuthorization';
import { ResourceError, ResourceErrorReason } from '../errors';
import { FlagStore } from './FlagStore';
import { sendFlagToSlack } from './gateways/SlackGateway';

/**
 * Create a flag for a specified rating
 * @Authorization
 * *** Must not be rating author ***
 * @export
 * @param params
 * @property { string } ratingId the id of the parent rating document
 * @property { UerToken } user current user information
 * @property { Flag } flag the flag being created
 * @returns { Promise<void> }
 */
export async function flagRating(params: {
    ratingId: string;
    user: UserToken;
    flag: Flag;
}): Promise<void> {
    try {
        const hasAccess = await hasFlagCreateAccess({
            user: params.user,
            ratingId: params.ratingId,
        });
        if (hasAccess) {
            await getDataStore().flagRating({
                ratingId: params.ratingId,
                flag: params.flag,
            });
            await sendFlagToSlack();
        } else {
            return Promise.reject(
                new ResourceError(
                    'Invalid Access',
                    ResourceErrorReason.INVALID_ACCESS,
                ),
            );
        }
    } catch (error) {
        return Promise.reject(`Problem flaging rating. Error: ${error}`);
    }
}

/**
 * Get all flags
 * @Authorization
 * *** Must be admin or editor ***
 * @export
 * @param params
 * @property { UserToken } user current user information
 * @returns { Promise<Flag[]> }
 */
export async function getAllFlags(params: {
    user: UserToken;
}): Promise<Flag[]> {
    try {
        const hasAccess = await hasPrivilegedAccess({
            user: params.user,
        });
        if (hasAccess) {
            const flags = await getDataStore().getAllFlags();
            return flags;
        } else {
            return Promise.reject(
                new ResourceError(
                    'Invalid Access',
                    ResourceErrorReason.INVALID_ACCESS,
                ),
            );
        }
    } catch (error) {
        return Promise.reject(`Problem getting all flags (ADMIN). Error: ${error}`);
    }
}

/**
 * Get all flags for a given rating
 * @Authorization
 * *** Must be admin or editor ***
 * @export
 * @param params
 * @property { UserToken } user current user information
 * @property { string } ratingId the id of the parent rating document
 * @returns { Promise<Flag[]> }
 */
export async function getRatingFlags (params: {
    ratingId: string,
    user: UserToken;
}): Promise<Flag[]> {
    try {
        const hasAccess = await hasPrivilegedAccess({
            user: params.user,
        });
        if (hasAccess) {
            const flags =  await getDataStore().getRatingFlags({
                ratingId: params.ratingId,
            });
            return flags;
        } else {
            return Promise.reject(
                new ResourceError(
                    'Invalid Access',
                    ResourceErrorReason.INVALID_ACCESS,
                ),
            );
        }
    } catch (error) {
        return Promise.reject(`Problem getting rating flags (ADMIN). Error: ${error}`);
    }
}

/**
 * Delete a flag
 * @Authorization
 * *** Must be admin or editor ***
 * @export
 * @param params
 * @property { UserToken } user current user information
 * @property { string } flagId the id of the flag
 * @returns { Promise<void> }
 */
export async function deleteFlag (params: {
    flagId: string,
    user: UserToken;
}): Promise<void> {
    try {
        const hasAccess = await hasPrivilegedAccess({
            user: params.user,
        });
        if (hasAccess) {
            await getDataStore().deleteFlag({
                flagId: params.flagId,
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
        return Promise.reject(`Problem deleting flag (ADMIN). Error: ${error}`);
    }
}

/**
 * Fetch instance of datastore
 * @returns { FlagDataStore }
 */
function getDataStore() {
    return FlagStore.getInstance();
}

