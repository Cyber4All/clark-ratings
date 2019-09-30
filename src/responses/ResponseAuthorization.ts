import { ResponseDataStore } from './interfaces/ResponseDataStore';
import { UserToken } from '../types/UserToken';
import { ResourceError, ResourceErrorReason } from '../errors';
import { getLearningObject } from '../drivers/LearningObjectServiceConnector';
import { getRating } from '../ratings/interactors/RatingsInteractor';
import { getResponses } from './ResponseInteractor';

/**
 * Checks if a user has the authority to create a response
 *
 * @export
 * @typedef {Object} params
 * @property {DataStore} dataStore instance of DataStore
 * @property {UserToken} user UserToken object
 * @property {string} ratingID ID of specified rating
 *
 * @returns Promise<boolean>
 */
export async function hasResponseCreateAccess(params: {
    dataStore: ResponseDataStore;
    user: UserToken;
    ratingID: string;
}): Promise<boolean> {
    return(
        await isLearningObjectAuthorOrContributor({
            dataStore: params.dataStore,
            user: params.user,
            ratingID: params.ratingID,
        })  &&
        await hasResponse({
            ratingID: params.ratingID,
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
 * @property {string} ratingID ID of specified rating
 *
 * @returns Promise<boolean>/
 */
export async function hasResponseUpdateDeleteAccess(params: {
    dataStore: ResponseDataStore;
    user: UserToken;
    responseID: string;
}): Promise<boolean> {
    return(
        await isResponseAuthor({
            dataStore: params.dataStore,
            user: params.user,
            responseID: params.responseID,
        })
    );
}

async function isResponseAuthor(params: {
    dataStore: ResponseDataStore;
    user: UserToken;
    responseID: string;
}): Promise<boolean> {
    const response = await params.dataStore.getResponseById({
        responseID: params.responseID,
    });
    if (!response) {
        throw new ResourceError(
            'Response not found',
            ResourceErrorReason.NOT_FOUND,
        );
    }
    return response.user.username === params.user.username;
}

async function isLearningObjectAuthorOrContributor(params: {
    dataStore: ResponseDataStore;
    user: UserToken;
    ratingID: string;
}): Promise<boolean> {
    const rating = await getRating({
        ratingID: params.ratingID,
    });
    const learningObject = await getLearningObject({
        CUID: rating.source.CUID,
        version: rating.source.version,
    });
    if (!learningObject) {
        throw new ResourceError(
            'Learning Object not found',
            ResourceErrorReason.NOT_FOUND,
        );
    }
    const owners = learningObject.contributors.map((user: {username: string}) => user.username);
    owners.push(learningObject.author.username);
    return owners.includes(params.user.username);
}

/**
 * Checks if a rating already has a response
 * @export
 * @param params
 * @property { string } ratingID ID of the given rating
 * @returns { boolean }
 */
async function hasResponse( params: {
    ratingID: string;
}): Promise<boolean> {
    const response = await getResponses({
        ratingIDs: [params.ratingID],
    });
    return !(response.length > 0);
}


