import { DataStore } from '../interfaces/DataStore';
import { Rating, LearningObjectContainer, Flag } from '../types/Rating';
import { User } from '@cyber4all/clark-entity';

/**
 * Retrieves a single rating by ID
 * @param dataStore instance of DataStore
 * @param ratingId of the rating to be retrieved
 */
export async function getRating(params: {
    dataStore: DataStore;
    ratingId: string;
}): Promise<Rating> {
    try {
        let rating = await params.dataStore.getRating(params.ratingId);
        return rating;
    } catch (error) {
        return Promise.reject(`Problem getting rating. Error: ${error}`);
    }
}

/**
 * Updates a single rating
 * @param dataStore instance of DataStore
 * @param id of the rating to be retrieved
 * @param editRating object containing edits
 * @param currentUser object containing information of user that made request
 */
export async function updateRating(params: {
    dataStore: DataStore;
    ratingId: string;
    learningObjectName: string;
    learningObjectAuthor: string;
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
            await params.dataStore.updateRating(
                params.ratingId,
                params.updates,
            );
        } else {
            return Promise.reject(
                'Error! Current user is not the author of this review!',
            );
        }
    } catch (error) {
        return Promise.reject(`Problem updating rating. Error: ${error}`);
    }
}

/**
 * Deletes a single rating
 * @param dataStore instance of DataStore
 * @param ratingId of the rating to be retrieved
 * @param currentUser object containing information of user that made request
 */
export async function deleteRating(params: {
    dataStore: DataStore;
    ratingId: string;
    learningObjectName: string;
    learningObjectAuthor: string;
    currentUsername: string;
}): Promise<void> {
    try {
        const isRatingAuthor = await this.checkRatingAuthor(
            params.currentUsername,
            params.ratingId,
            params.dataStore,
        );
        if (isRatingAuthor) {
            await params.dataStore.deleteRating(
                params.ratingId,
                params.learningObjectName,
                params.learningObjectAuthor,
            );
        } else {
            return Promise.reject(
                'Error! Current user is not the author of this review!',
            );
        }
    } catch (error) {
        return Promise.reject(`Problem deleting rating. Error: ${error}`);
    }
}

/**
 * Get all ratings for a specified learning object
 * @param dataStore instance of DataStore
 * @param learningObjectName name of learning object
 */
export async function getLearningObjectRatings(params: {
    dataStore: DataStore;
    learningObjectId: string;
}): Promise<LearningObjectContainer> {
    try {
        const ratings = await params.dataStore.getLearningObjectsRatings(
            params.learningObjectId,
        );
        return ratings;
    } catch (error) {
        return Promise.reject(
            `Problem getting learning object ratings. Error: ${error}`,
        );
    }
}

/**
 * Create a new rating
 * @param dataStore instance of DataStore
 * @param rating object containing new rating information
 * @param learningObjectName name of learning object
 * @param username username to be appended to new rating document
 */
export async function createRating(params: {
    dataStore: DataStore;
    rating: Rating;
    learningObjectName: string;
    learningObjectAuthor: string;
    username: string;
    email: string;
    name: string;
}): Promise<void> {
    try {
        await params.dataStore.createNewRating(
            params.rating,
            params.learningObjectName,
            params.learningObjectAuthor,
            params.username,
            params.email,
            name,
        );
    } catch (error) {
        return Promise.reject(`Problem creating new rating. Error: ${error}`);
    }
}

/**
 * Get all ratings for a specified user
 * @param dataStore instance of DataStore
 * @param username username to search with
 */
export async function getUsersRatings(params: {
    dataStore: DataStore;
    username: string;
}): Promise<Rating[]> {
    try {
        const ratings = await params.dataStore.getUsersRatings(params.username);
        return ratings;
    } catch (error) {
        return Promise.reject(`Problem getting user ratings. Error ${error}`);
    }
}



/**
 * Helper method used to determine if the current user is the author
 * of a specified review
 * @param currentUser user object of current user
 * @param ratingId id of a rating object
 * @param dataStore instance of DataStore
 */
async function checkRatingAuthor(params: {
    currentUsername: string;
    ratingId: string;
    dataStore: DataStore;
}): Promise<boolean> {

    try {
        // Get rating object
        let isAuthor: boolean = false;
        const rating: Rating = await params.dataStore.getRating(params.ratingId);

        // Get populated user object
        const ratingUsername = rating.user.username;

        // Compare current user and specified rating author
        if (ratingUsername === params.currentUsername) {
        isAuthor = true;
        }

        return isAuthor;
    } catch (error) {
        return Promise.reject(`Probelm checking rating author.  Error: ${error}`);
    }
}

function checkLearningObjectAuthor(params: {
    currentUser: User;
    learningObjectAuthor: string;
}) {
    let isAuthor = false;
    if (params.currentUser.username === params.learningObjectAuthor) {
        isAuthor = true;
    }
    return isAuthor;
}
