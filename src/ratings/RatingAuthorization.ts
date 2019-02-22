import { RatingDataStore } from './interfaces/RatingDataStore';
import { UserToken } from '../types/UserToken';
import { ResourceError, ResourceErrorReason, ServiceError, ServiceErrorReason } from '../errors';
import { getLearningObject } from '../drivers/LearningObjectServiceConnector';

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
        return Promise.reject(
            new ServiceError(
                ServiceErrorReason.INTERNAL,
            ),
        );
    }
}

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
        return Promise.reject(
            new ServiceError(
                ServiceErrorReason.INTERNAL,
            ),
        );
    }
}

async function hasPrivilegedAccess(params: {
    user: UserToken;
}): Promise<boolean> {
    return params.user.accessGroups.includes('admin') || params.user.accessGroups.includes('editor');
}
