import { DataStore } from '../interfaces/interfaces';
import { ResourceError, ResourceErrorReason } from '../errors';
import { userInfo } from 'os';

/**
 * Checks if a user has the authority to update a Rating
 *
 * @export
 * @typedef {Object} params
 * @property {DataStore} dataStore instance of DataStore
 * @property {UserToken} user UserToken object
 * @property {string} ratingId id of specified rating
 *
 * @returns Promise<boolean>/
 */
export async function hasRatingUpdateAccess(params: {
    dataStore: DataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    return(
        await isAuthor({
            dataStore: params.dataStore,
            user: params.user,
            ratingId: params.ratingId,
        })
    );
}

/**
 * Checks if a user has the authority to delete a Rating
 *
 * @export
 * @typedef {Object} params
 * @property {DataStore} dataStore instance of DataStore
 * @property {UserToken} user UserToken object
 * @property {string} ratingId id of specified rating
 *
 * @returns Promise<boolean>/
 */
export async function hasRatingDeleteAccess(params: {
    dataStore: DataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    return(
        await isAuthor({
            dataStore: params.dataStore,
            user: params.user,
            ratingId: params.ratingId,
        }) ||
        await hasPrivilegedAccess({
            dataStore: params.dataStore,
            user: params.user,
            ratingId: params.ratingId,
        })
    );
}

async function isAuthor(params: {
    dataStore: DataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    try {
        const rating = await params.dataStore.getRating(params.ratingId);
        if (rating.user.username === params.user.username) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return Promise.reject(
            new ResourceError(
                'User is not author of the specified rating',
                ResourceErrorReason.INVALID_ACCESS,
            ),
        );
    }
}

async function hasPrivilegedAccess(params: {
    dataStore: DataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    try {
        if (user.accessGroups) {
            if (isAdminOrEditor(user.accessGroups)) {
                return true;
            } else {
                return checkCollectionWriteAccess({ user, dataStore, objectId });
            }
        } else {
            return false;
        }
    } catch (error) {
        return Promise.reject(
            new ResourceError(
                'User is not a member of required access group',
                ResourceErrorReason.INVALID_ACCESS,
            ),
        );
    }
}

/**
 * Checks if accessGroups contains admin or editor
 *
 * @param {string[]} accessGroups
 * @returns {boolean}
 */
export function isAdminOrEditor(accessGroups: string[]): boolean {
    return (
      accessGroups.includes(UserRole.ADMIN) ||
      accessGroups.includes(UserRole.EDITOR)
    );
  }



