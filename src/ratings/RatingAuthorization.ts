import { RatingDataStore } from './interfaces/RatingDataStore';
import { UserToken } from '../types/UserToken';
import { ResourceError, ResourceErrorReason } from '../errors';
import { getLearningObject } from '../drivers/LearningObjectServiceConnector';

/**
 * Checks if a user has the authority to create a Rating
 *
 * @export
 * @typedef {Object} params
 * @property {UserToken} user UserToken object
 * @property {string} ratingID id of specified rating
 *
 * @returns Promise<boolean>
 */
export async function hasRatingCreateAccess(params: {
    user: UserToken;
    CUID: string;
    versionID: string;
}): Promise<boolean> {
    const isAuthor = await isLearningObjectAuthor({
        user: params.user,
        CUID: params.CUID,
        versionID: params.versionID,
    });
    // The author of a Learning Object cannot leave a rating
    const hasCreateAccess = !isAuthor;
    return hasCreateAccess;
}

/**
 * Checks if a user has the authority to update a Rating
 *
 * @export
 * @typedef {Object} params
 * @property {DataStore} dataStore instance of DataStore
 * @property {UserToken} user UserToken object
 * @property {string} ratingID id of specified rating
 *
 * @returns Promise<boolean>/
 */
export async function hasRatingUpdateAccess(params: {
    dataStore: RatingDataStore;
    user: UserToken;
    ratingID: string;
}): Promise<boolean> {
    return(
        await isRatingAuthor({
            dataStore: params.dataStore,
            user: params.user,
            ratingID: params.ratingID,
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
 * @property {string} ratingID id of specified rating
 *
 * @returns Promise<boolean>/
 */
export async function hasRatingDeleteAccess(params: {
    dataStore: RatingDataStore;
    user: UserToken;
    ratingID: string;
}): Promise<boolean> {
    return(
        await isRatingAuthor({
            dataStore: params.dataStore,
            user: params.user,
            ratingID: params.ratingID,
        }) ||
        await hasPrivilegedAccess({
            user: params.user,
        })
    );
}

/**
 * Checks if a user is the author of rating
 *
 * @export
 * @typedef {Object} params
 * @property {DataStore} dataStore instance of RatingDataStore
 * @property {UserToken} user UserToken object
 * @property {string} ratingID id of specified rating
 *
 * @returns Promise<boolean>
 */
async function isRatingAuthor(params: {
    dataStore: RatingDataStore;
    user: UserToken;
    ratingID: string;
}): Promise<boolean> {
    const rating = await params.dataStore.getRating({
        ratingID: params.ratingID,
    });
    return rating.user.username === params.user.username;
}

/**
 * Checks if a user is the author of learning object
 *
 * @export
 * @typedef {Object} params
 * @property {UserToken} user UserToken object
 * @property {string} learningobjectId id of specified learning object
 *
 * @returns Promise<boolean>
 */
async function isLearningObjectAuthor(params: {
    user: UserToken;
    CUID: string;
    versionID: string;
}): Promise<boolean> {
    const learningObject = await getLearningObject({
        CUID: params.CUID,
        versionID: params.versionID,
    });
    if (!learningObject) {
        throw new ResourceError(
            'Learning Object not found',
            ResourceErrorReason.NOT_FOUND,
        );
    }
    return learningObject.author.username === params.user.username;
}

/**
 * Checks if a user has admin or editor access
 *
 * @export
 * @typedef {Object} params
 * @property {UserToken} user UserToken object
 *
 * @returns Promise<boolean>
 */
async function hasPrivilegedAccess(params: {
    user: UserToken;
}): Promise<boolean> {
    return params.user.accessGroups.includes('admin') || params.user.accessGroups.includes('editor');
}
