import { Rating, LearningObjectContainer } from '../types/Rating';
import { ResourceError, ResourceErrorReason, ServiceError, ServiceErrorType } from '../errors';
import { reportError } from '../drivers/SentryConnector';
import { RatingDataStore } from './interfaces/RatingDataStore';

/**
 * get a rating object
 * @export
 * @param params
 * @property { RatingDataStore } dataStore instance of RatingDataStore
 * @property { string } ratingId the id of the parent rating document
 * @returns { Promise<Rating> }
 */
export async function getRating(params: {
    dataStore: RatingDataStore;
    ratingId: string;
}): Promise<Rating> {
    try {
        let rating = await params.dataStore.getRating({
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
 * @export
 * @param params
 * @property { RatingDataStore } dataStore instance of RatingDataStore
 * @property { string } ratingId the id of the parent rating document
 * @property { Rating } updates updated rating object
 * @property { stringg } currentUsername username of user trying to update
 * @returns { Promise<void> }
 */
export async function updateRating(params: {
    dataStore: RatingDataStore;
    ratingId: string;
    updates: Rating;
    currentUsername: string;
}): Promise<void> {
    try {
        const isRatingAuthor = await this.checkRatingAuthor(
            params.currentUsername,
            params.ratingId,
            params.dataStore,
        );
        if (isRatingAuthor) {
            await params.dataStore.updateRating({
                ratingId: params.ratingId,
                updates: params.updates,
            });
        } else {
            return Promise.reject(
                new ResourceError(
                    'Error! Current user is not the author of this review!',
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
 * @export
 * @param params
 * @property { RatingDataStore } dataStore instance of RatingDataStore
 * @property { string } ratingId the id of the parent rating document
 * @property { stringg } currentUsername username of user trying to update
 * @returns { Promise<void> }
 */
export async function deleteRating(params: {
    dataStore: RatingDataStore;
    ratingId: string;
    currentUsername: string;
}): Promise<void> {
    try {
        const isRatingAuthor = await this.checkRatingAuthor(
            params.currentUsername,
            params.ratingId,
            params.dataStore,
        );
        if (isRatingAuthor) {
            await params.dataStore.deleteRating({
                ratingId: params.ratingId,
            });
        } else {
            return Promise.reject(
                new ResourceError(
                    'Error! Current user is not the author of this review!',
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
    dataStore: RatingDataStore;
    learningObjectId: string;
}): Promise<LearningObjectContainer> {
    try {
        const ratings = await params.dataStore.getLearningObjectsRatings({
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
    dataStore: RatingDataStore;
    rating: Rating;
    learningObjectId: string,
    username: string;
    email: string;
    name: string;
}): Promise<void> {
    try {
        await params.dataStore.createNewRating({
            rating: params.rating,
            learningObjectId: params.learningObjectId,
            username: params.username,
            email: params.email,
            name,
        });
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
 * @export
 * @param params
 * @property { RatingDataStore } dataStore instance of RatingDataStore
 * @property { string } username username of rating author
 * @returns { Promise<Rating[]> }
 */
export async function getUsersRatings(params: {
    dataStore: RatingDataStore;
    username: string;
}): Promise<Rating[]> {
    try {
        const ratings = await params.dataStore.getUsersRatings({
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
