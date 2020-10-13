import { Rating } from '../../types/Rating';
import { ResourceError, ResourceErrorReason } from '../../errors';
import { UserToken } from '../../types/UserToken';
import { hasRatingDeleteAccess, hasRatingUpdateAccess, hasRatingCreateAccess } from '../RatingAuthorization';
import { RatingStore } from '../RatingStore';
import { RatingNotifier } from '../interfaces/RatingNotifier';
import { getLearningObject } from '../../drivers/LearningObjectServiceConnector';
import { EMAIL_TYPE, SendgridDriver } from '../../drivers/SendgridDriver';
import { NewRatingData } from '../../types/NewRatingData';

/**
 * Get a rating object
 * @export
 * @param params
 * @property { string } ratingID the ID of the parent rating document
 * @returns { Promise<Rating> }
 */
export async function getRating(params: {
    ratingID: string;
}): Promise<Rating> {
    const rating = await getDataStore().getRating({
        ratingID: params.ratingID,
    });
    if (!rating) {
        throw new ResourceError(
            'Could not fetch rating',
            ResourceErrorReason.NOT_FOUND,
        );
    }
    return rating;
}

/**
 * Update a rating object
 * @Authorization
 * *** Must be rating author ***
 * @export
 * @param params
 * @property { string } ratingID the ID of the parent rating document
 * @property { Rating } updates updated rating object
 * @property { UserToken } user username of user trying to update
 * @returns { Promise<void> }
 */
export async function updateRating(params: {
    username: string;
    ratingID: string;
    updates: Rating;
    CUID: string;
    version: string;
    user: UserToken;
}): Promise<void> {
    const hasAccess = await hasRatingUpdateAccess({
        dataStore: getDataStore(),
        user: params.user,
        ratingID: params.ratingID,
    });
    if (!hasAccess) {
        throw new ResourceError(
            'Invalid Access',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }

    const learningObject = await getLearningObject({
        user: params.user,
        username: params.username,
        CUID: params.CUID,
        version: params.version,
    });
    if (!learningObject) {
        throw new ResourceError(
            'Specified Learning Object does not exist',
            ResourceErrorReason.NOT_FOUND,
        );
    }

    if (learningObject.status !== 'released') {
        throw new ResourceError(
            'Invalid Access: You cannot write a review to an object in the review process or is unreleased',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }

    await getDataStore().updateRating({
        ratingID: params.ratingID,
        updates: params.updates,
    });
}

/**
 * Delete a rating object
 * @Authorization
 * *** Must be rating author or have admin/editor access ***
 * @export
 * @param params
 * @property { string } ratingID the ID of the parent rating document
 * @property { UerToken } user username of user trying to update
 * @returns { Promise<void> }
 */
export async function deleteRating(params: {
    username: string;
    ratingID: string;
    CUID: string;
    version: string;
    user: UserToken;
}): Promise<void> {
    const hasAccess = await hasRatingDeleteAccess({
        dataStore: getDataStore(),
        user: params.user,
        ratingID: params.ratingID,
    });
    if (!hasAccess) {
        throw new ResourceError(
            'Invalid Access',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }

    const learningObject = await getLearningObject({
        user: params.user,
        username: params.username,
        CUID: params.CUID,
        version: params.version,
    });
    if (!learningObject) {
        throw new ResourceError(
            'Specified Learning Object does not exist',
            ResourceErrorReason.NOT_FOUND,
        );
    }

    await getDataStore().deleteRating({
        ratingID: params.ratingID,
    });
}

/**
 * Fetch all ratings for a learning object
 * @export
 * @param params
 * @property { RatingDataStore } dataStore instance of RatingDataStore
 * @property { string } CUID the CUID of the learning object
 * @returns { Promise<void> }
 */
export async function getLearningObjectRatings(params: {
    user: UserToken;
    CUID: string;
    version: string;
    username: string;
}): Promise<object> {
    const learningObject = await getLearningObject({
        user: params.user,
        CUID: params.CUID,
        version: params.version,
        username: params.username,
    });

    if (!learningObject) {
        throw new ResourceError(
            'Specified Learning Object does not exist',
            ResourceErrorReason.NOT_FOUND,
        );
    }

    const ratings = await getDataStore().getLearningObjectsRatings({
        CUID: params.CUID,
    });
    return ratings;
}

/**
 * Create a rating object
 * @Authorization
 * *** Cannot be author of learning object, Email Verified ***
 * @export
 * @param params
 * @property { Rating } rating the rating being created
 * @property { string } CUID the CUID of the learning object
 * @property { UserToken } user current user info
 * @returns  { Promise<void> }
 */
export async function createRating(params: {
    username: string;
    rating: Rating;
    CUID: string;
    version: string;
    user: UserToken;
    ratingNotifier: RatingNotifier;
}): Promise<void> {
    const hasAccess = await hasRatingCreateAccess({
        username: params.username,
        CUID: params.CUID,
        version: params.version,
        user: params.user,
    });
    if (!hasAccess) {
        throw new ResourceError(
            'Invalid Access',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }

    const learningObject = await getLearningObject({
        user: params.user,
        username: params.username,
        CUID: params.CUID,
        version: params.version,
    });

    // Throw error if trying to write a rating to an in review object
    if (learningObject.status !== 'released') {
        throw new ResourceError(
            'Invalid Access: You cannot write a review to an object in the review process or is unreleased',
            ResourceErrorReason.INVALID_ACCESS,
        );
    }

    const ratingUser = {
        username: params.user.username,
        name: params.user.name,
        email: params.user.email,
    };
    await getDataStore().createNewRating({
        rating: params.rating,
        CUID: params.CUID,
        version: params.version,
        user: ratingUser,
    });

    await params.ratingNotifier.sendRatingNotification({
        ratingAuthor: params.user.username,
        ratingComment: params.rating.comment,
        learningObjectCuid: learningObject.cuid,
        learningObjectAuthorUsername: learningObject.author.username,
    });

    // Send new rating email to author
    const ratings = await getDataStore().getLearningObjectsRatings({CUID: learningObject.cuid});
    const name: Array<string> = learningObject.author.name ? learningObject.author.name.split(' ') : 'Contributor';
    const data: NewRatingData = {
        user: {
            firstName: name[0].charAt(0).toUpperCase() + name[0].substring(1),
            username: learningObject.author.username
        },
        object: {
            cuid: learningObject.cuid,
            name: learningObject.name,
            avgRating: ratings.avgValue
        }
    };
    await SendgridDriver.getInstance().sendEmail(learningObject.author.email, EMAIL_TYPE.NEW_RATING, data);
}

function getDataStore() {
    return RatingStore.getInstance();
}
