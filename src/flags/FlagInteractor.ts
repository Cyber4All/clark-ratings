import { Flag } from '../types/Flag';
import { UserToken } from '../types/UserToken';
import { hasFlagCreateAccess, hasPrivilegedAccess } from './FlagAuthorization';
import { ResourceError, ResourceErrorReason } from '../errors';
import { FlagStore } from './FlagStore';
import { getLearningObject } from '../drivers/LearningObjectServiceConnector';
import { getRating } from './gateways/RatingGateway';
import { FlagNotifier } from './interfaces/FlagNotifier';
import { reportError } from '../drivers/SentryConnector';

/**
 * Create a flag for a specified rating
 * @Authorization
 * *** Must not be rating author ***
 * @export
 * @param params
 * @property { string } ratingID the ID of the parent rating document
 * @property { UerToken } user current user information
 * @property { Flag } flag the flag being created
 * @returns { Promise<void> }
 */
export async function flagRating(params: {
    ratingID: string;
    CUID: string;
    versionID: string;
    user: UserToken;
    flag: Flag;
    flagNotifier: FlagNotifier;
}): Promise<void> {
    const hasAccess = await hasFlagCreateAccess({
        user: params.user,
        ratingID: params.ratingID,
    });
    if (!hasAccess) {
        throw new ResourceError(
            'Invalid Access',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }
    await getDataStore().flagRating({
        ratingID: params.ratingID,
        flag: params.flag,
    });
    const rating = await getRating(params.ratingID);
    const learningObject = await getLearningObject({
        CUID: params.CUID,
        versionID: params.versionID,
    });
    params.flagNotifier.sendFlagNotification(params.user.username, rating.comment, learningObject.name, learningObject.author.username).catch(error => {
        reportError(error);
    });
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
    const hasAccess = await hasPrivilegedAccess({
        user: params.user,
    });
    if (!hasAccess) {
        throw new ResourceError(
            'Invalid Access',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }
    const flags = await getDataStore().getAllFlags();
    return flags;
}

/**
 * Get all flags for a given rating
 * @Authorization
 * *** Must be admin or editor ***
 * @export
 * @param params
 * @property { UserToken } user current user information
 * @property { string } ratingID the ID of the parent rating document
 * @returns { Promise<Flag[]> }
 */
export async function getRatingFlags (params: {
    ratingID: string,
    user: UserToken;
}): Promise<Flag[]> {
    const hasAccess = await hasPrivilegedAccess({
        user: params.user,
    });
    if (!hasAccess) {
        throw new ResourceError(
            'Invalid Access',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }
    const flags =  await getDataStore().getRatingFlags({
        ratingID: params.ratingID,
    });
    return flags;
}

/**
 * Delete a flag
 * @Authorization
 * *** Must be admin or editor ***
 * @export
 * @param params
 * @property { UserToken } user current user information
 * @property { string } flagID the ID of the flag
 * @returns { Promise<void> }
 */
export async function deleteFlag (params: {
    flagID: string,
    user: UserToken;
}): Promise<void> {
    const hasAccess = await hasPrivilegedAccess({
        user: params.user,
    });
    if (!hasAccess) {
        throw new ResourceError(
            'Invalid Access',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }
    await getDataStore().deleteFlag({
        flagID: params.flagID,
    });
}

/**
 * Fetch instance of datastore
 * @returns { FlagDataStore }
 */
function getDataStore() {
    return FlagStore.getInstance();
}

