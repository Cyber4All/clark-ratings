import { Flag } from '../types/Flag';
import { FlagDataStore } from './interfaces/FlagDataStore';
import { UserToken } from '../types/UserToken';
import { hasFlagCreateAccess } from './FlagAuthorization';
import { ResourceError, ResourceErrorReason } from '../errors';

/**
 * Create a flag for a specified rating
 * @Authorization
 * *** Must not be rating author ***
 * @export
 * @param params
 * @property { FlagDataStore } dataStore instance of FlagDataStore
 * @property { string } ratingId the id of the parent rating document
 * @property { UerToken } user current user information
 * @property { Flag } flag the flag being created
 * @returns { Promise<void> }
 */
export async function flagRating(params: {
    dataStore: FlagDataStore;
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
            await params.dataStore.flagRating({
                ratingId: params.ratingId,
                flag: params.flag,
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
        return Promise.reject(new Error(`Problem flaging rating. Error: ${error}`));
    }
}

/**
 * Fetch all flags
 * @export
 * @param {{
 *   dataStore: DataStore;
 * }}
 * @returns Promise<Flag[]>
 */
export async function getAllFlags(params: {
    dataStore: FlagDataStore,
}): Promise<Flag[]> {
    try {
        const flags = await params.dataStore.getAllFlags();
        return flags;
    } catch (error) {
        return Promise.reject(`Problem getting all flags (ADMIN). Error: ${error}`);
    }
}

/**
 * Fetch all flags for a given ratings
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   ratingId: string;
 * }}
 * @returns Promise<Flag[]>
 */
export async function getRatingFlags (params: {
    dataStore: FlagDataStore,
    ratingId: string,
}): Promise<Flag[]> {
    try {
        const flags = await params.dataStore.getRatingFlags({
            ratingId: params.ratingId,
        });
        return flags;
    } catch (error) {
        return Promise.reject(`Problem getting rating flags (ADMIN). Error: ${error}`);
    }
}

/**
 * Delete a flag
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   flagId: string;
 * }}
 * @returns Promise<void>
 */
export async function deleteFlag (params: {
    dataStore: FlagDataStore,
    flagId: string,
}): Promise<void> {
    try {
        await params.dataStore.deleteFlag({
            flagId: params.flagId,
        });
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(`Problem deleting flag (ADMIN). Error: ${error}`);
    }
}

