import { Rating, LearningObjectContainer } from '../types/Rating';
import { ResourceError, ResourceErrorReason, ServiceError, ServiceErrorType } from '../errors';
import { reportError } from '../drivers/SentryConnector';
import { UserToken } from '../types/UserToken';
import { hasRatingCreateAccess, hasRatingDeleteAccess, hasRatingUpdateAccess } from './RatingAuthorization';
import { RatingStore } from './RatingStore';
import { getResponse, getResponses } from '../responses/ResponseInteractor';
import { disableConsoleAlerts } from 'raven';
import { listenerCount } from 'cluster';

/**
 * get a rating object
 * @export
 * @param params
 * @property { RatingDataStore } dataStore instance of RatingDataStore
 * @property { string } ratingId the id of the parent rating document
 * @returns { Promise<Rating> }
 */
export async function getRating(params: {
    ratingId: string;
}): Promise<Rating> {
    try {
        const rating = await getDataStore().getRating({
            ratingId: params.ratingId,
        });
        return rating;
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ResourceError(
                'Could not fetch rating',
                ResourceErrorReason.NOT_FOUND,
            ),
        );
    }
}


/**
 * update a rating object
 * @Authorization
 * *** Must be rating author ***
 * @export
 * @param params
 * @property { RatingDataStore } dataStore instance of RatingDataStore
 * @property { string } ratingId the id of the parent rating document
 * @property { Rating } updates updated rating object
 * @property { stringg } currentUsername username of user trying to update
 * @returns { Promise<void> }
 */
export async function updateRating(params: {
    ratingId: string;
    updates: Rating;
    user: UserToken;
}): Promise<void> {
    try {
        const hasAccess = await hasRatingUpdateAccess({
            dataStore: getDataStore(),
            user: params.user,
            ratingId: params.ratingId,
        });
        if (hasAccess) {
            await getDataStore().updateRating({
                ratingId: params.ratingId,
                updates: params.updates,
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
        reportError(error);
        return Promise.reject(
            new ServiceError(ServiceErrorType.INTERNAL),
        );
    }
}

/**
 * delete a rating object
 * @Authorization
 * *** Must be rating author or have admin/editor access ***
 * @export
 * @param params
 * @property { RatingDataStore } dataStore instance of RatingDataStore
 * @property { string } ratingId the id of the parent rating document
 * @property { stringg } currentUsername username of user trying to update
 * @returns { Promise<void> }
 */
export async function deleteRating(params: {
    ratingId: string;
    user: UserToken;
}): Promise<void> {
    try {
        const hasAccess = await hasRatingDeleteAccess({
            dataStore: getDataStore(),
            user: params.user,
            ratingId: params.ratingId,
        });
        if (hasAccess) {
            await getDataStore().deleteRating({
                ratingId: params.ratingId,
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
        reportError(error);
        return Promise.reject(
            new ServiceError(
                ServiceErrorType.INTERNAL,
            ),
        );
    }
}

/**
 * Fetch all ratings for a learning object
 * @export
 * @param params
 * @property { RatingDataStore } dataStore instance of RatingDataStore
 * @property { string } learningObjectId the id of the learning object
 * @returns { Promise<void> }
 */
export async function getLearningObjectRatings(params: {
    learningObjectId: string;
}): Promise<object> {
    try {
        const ratings = await getDataStore().getLearningObjectsRatings({
            learningObjectId: params.learningObjectId,
        });
        return ratings;
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ServiceError(
                ServiceErrorType.INTERNAL,
            ),
        );
    }
}

/**
 * Create a rating object
 * @Authorization
 * *** Cannot be author of learning object, Email Verified ***
 * @export
 * @param params
 * @property { RatingDataStore } dataStore instance of RatingDataStore
 * @property { Rating } rating the rating being created
 * @property { string } learningObjectId the id of the learning object
 * @property { string } username username of rating author
 * @property { string } email email of rating author
 * @property { string } name name of rating author
 * @returns  { Promise<void> }
 */
export async function createRating(params: {
    rating: Rating;
    learningObjectId: string,
    user: UserToken;
}): Promise<void> {
    try {
        const hasAccess = await hasRatingCreateAccess({
            learningObjectId: params.learningObjectId,
            user: params.user,
        });
        if (hasAccess) {
            const ratingUser = {
                username: params.user.username,
                name: params.user.name,
                email: params.user.email,
            };
            await getDataStore().createNewRating({
                rating: params.rating,
                learningObjectId: params.learningObjectId,
                user: ratingUser,
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
        reportError(error);
        return Promise.reject(
            new ServiceError(
                ServiceErrorType.INTERNAL,
            ),
        );
    }
}

/**
 * fetch all ratings for a given user
 * @Authorization
 * *** Admin Editor Reviewer@collection Curator@collection ***
 * @export
 * @param params
 * @property { RatingDataStore } dataStore instance of RatingDataStore
 * @property { string } username username of rating author
 * @returns { Promise<Rating[]> }
 */
export async function getUsersRatings(params: {
    username: string;
}): Promise<Rating[]> {
    try {
        const ratings = await getDataStore().getUsersRatings({
            username: params.username,
        });
        return ratings;
    } catch (error) {
        reportError(error);
        return Promise.reject(
            new ServiceError(
                ServiceErrorType.INTERNAL,
            ),
        );
    }
}

function getDataStore() {
    return RatingStore.getInstance();
}
