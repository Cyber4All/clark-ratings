import { RatingDataStore } from './interfaces/RatingDataStore';
import { UserToken } from '../types/UserToken';
import { ResourceError, ResourceErrorReason, ServiceError, ServiceErrorReason } from '../errors';
import { getLearningObject } from '../drivers/LearningObjectServiceConnector';
import { reportError } from '../drivers/SentryConnector';

/**
 * Checks if a user has the authority to update a Rating
 *
 * @export
 * @typedef {Object} params
 * @property {UserToken} user UserToken object
 * @property {string} ratingId id of specified rating
 *
 * @returns Promise<boolean>
 */
export async function hasRatingCreateAccess(params: {
    user: UserToken;
    learningObjectId: string;
}): Promise<boolean> {
    return !(
        await isLearningObjectAuthor({
            user: params.user,
            learningObjectId: params.learningObjectId,
        })
    );
}

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
    dataStore: RatingDataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    return(
        await isRatingAuthor({
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
    dataStore: RatingDataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    return(
        await isRatingAuthor({
            dataStore: params.dataStore,
            user: params.user,
            ratingId: params.ratingId,
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
 * @property {string} ratingId id of specified rating
 *
 * @returns Promise<boolean>
 */
async function isRatingAuthor(params: {
    dataStore: RatingDataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    try {
        const rating = await params.dataStore.getRating({
            ratingId: params.ratingId,
        });
        return rating.user.username === params.user.username;
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ServiceError(
                ServiceErrorReason.INTERNAL,
            ),
        );
    }
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
    learningObjectId: string;
}): Promise<boolean> {
    try {
        const learningObject = await getLearningObject({
            learningObjectId: params.learningObjectId,
        });
        if (learningObject === null) {
            return Promise.reject(
                new ResourceError(
                    'Learning Object not found',
                    ResourceErrorReason.NOT_FOUND,
                ),
            );
        }
        return learningObject.author.username === params.user.username;
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ServiceError(
                ServiceErrorReason.INTERNAL,
            ),
        );
    }
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
