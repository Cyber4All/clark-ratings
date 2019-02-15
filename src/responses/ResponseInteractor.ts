import { Rating } from '../types/Rating';
import { User } from '@cyber4all/clark-entity';
import { ResourceError, ResourceErrorReason, ServiceError, ServiceErrorType } from '../errors';
import { reportError } from '../drivers/SentryConnector';

/**
 * Retrieves a single rating by ID
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   ratingId: string;
 * }}
 * @returns Promise<Rating>
 */
export async function deleteResponse(params: {
    dataStore: ResponseDataStore;
    ratingId: string;
    username: string;
}): Promise<void> {
    try {
        await params.dataStore.getRating(params.ratingId);
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
 * Update a rating specified by id
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   ratingId: string;
 *   updates: Rating;
 *   currentUsername: string;
 * }}
 * @returns Promise<void>
 */
export async function updateResponse(params: {
    dataStore: DataStore;
    ratingId: string;
    updates: Rating;
    username: string;
}): Promise<void> {
    try {
        const isResponseAuthor = await this.checkResponseAuthor(
            params.username,
            params.ratingId,
            params.dataStore,
        );
        if (isResponseAuthor) {
            await params.dataStore.updateRating(
                params.ratingId,
                params.updates,
            );
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
 * Delete a specified rating
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   ratingId: string;
 *   currentUsername: string;
 * }}
 * @returns Promise<void>
 */
export async function createResponse(params: {
    dataStore: DataStore;
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
            await params.dataStore.deleteRating(
                params.ratingId,
            );
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
 * Checks if user is author of specified rating
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   currentUSername: string;
 *   ratingId: string;
 * }}
 * @returns Promise<boolean>
 */
async function checkResponseAuthor(params: {
    dataStore: DataStore;
    currentUsername: string;
    ratingId: string;
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
        reportError(error);
        return Promise.reject(
            new ServiceError(
                ServiceErrorType.INTERNAL,
            ),
        );
    }
}

/**
 * Checks if user is author of specified learning object
 * @export
 * @param {{
 *   currentUser: User;
 *   learningObjectAuthor: string;
 * }}
 * @returns boolean
 */
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
