import { ResponseDataStore } from './interfaces/ResponseDataStore';
import { UserToken } from '../types/UserToken';
import { ResourceError, ResourceErrorReason, ServiceErrorType, ServiceError } from '../errors';
import { getLearningObject } from '../drivers/LearningObjectServiceConnector';
import { getRating } from '../ratings/RatingsInteractor';

/**
 * Checks if a user has the authority to create a response
 *
 * @export
 * @typedef {Object} params
 * @property {DataStore} dataStore instance of DataStore
 * @property {UserToken} user UserToken object
 * @property {string} ratingId id of specified rating
 *
 * @returns Promise<boolean>/
 */
export async function hasResponseCreateAccess(params: {
    dataStore: ResponseDataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    return(
        await isLearningObjectAuthorOrContributor({
            dataStore: params.dataStore,
            user: params.user,
            ratingId: params.ratingId,
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
export async function hasResponseUpdateDeleteAccess(params: {
    dataStore: ResponseDataStore;
    user: UserToken;
    responseId: string;
}): Promise<boolean> {
    return(
        await isResponseAuthor({
            dataStore: params.dataStore,
            user: params.user,
            responseId: params.responseId,
        })
    );
}

async function isResponseAuthor(params: {
    dataStore: ResponseDataStore;
    user: UserToken;
    responseId: string;
}): Promise<boolean> {
    try {
        const response = await params.dataStore.getResponseById({
            responseId: params.responseId,
        });
        if (response.user.username === params.user.username) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return Promise.reject(
            new ResourceError(
                'User is not author of the specified response',
                ResourceErrorReason.INVALID_ACCESS,
            ),
        );
    }
}

async function isLearningObjectAuthorOrContributor(params: {
    dataStore: ResponseDataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    try {
        const rating = await getRating({
            ratingId: params.ratingId,
        });
        const learningObject = await getLearningObject({
            learningObjectId: rating.source,
        });
        if (learningObject === null) {
            return Promise.reject(
                new ResourceError(
                    'Learning Object not found',
                    ResourceErrorReason.NOT_FOUND,
                ),
            );
        }
        const owners = learningObject.contributors.map(user => user.username);
        owners.push(learningObject.author.username);
        if (owners.includes(params.user.username)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return Promise.reject(
            new ServiceError(
                ServiceErrorType.INTERNAL,
            ),
        );
    }
}


