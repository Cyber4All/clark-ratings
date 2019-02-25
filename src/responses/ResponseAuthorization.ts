import { ResponseDataStore } from './interfaces/ResponseDataStore';
import { UserToken } from '../types/UserToken';
import { ResourceError, ResourceErrorReason } from '../errors';
import { getLearningObject } from '../drivers/LearningObjectServiceConnector';
import { getRating } from '../ratings/RatingsInteractor';
import { getResponses } from './ResponseInteractor';

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
        })  &&
        await checkAvailability({
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
    const response = await params.dataStore.getResponseById({
        responseId: params.responseId,
    });
    if (response === null) {
        return Promise.reject(
            new ResourceError(
                'Response not found',
                ResourceErrorReason.NOT_FOUND,
            ),
        );
    }
    return response.user.username === params.user.username;
}

async function isLearningObjectAuthorOrContributor(params: {
    dataStore: ResponseDataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
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
    return owners.includes(params.user.username);
}

async function checkAvailability( params: {
    ratingId: string;
}): Promise<boolean> {
    const response = await getResponses({
        ratingIds: [params.ratingId],
    });
    return !(response.length > 0);
}


