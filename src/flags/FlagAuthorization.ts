import { UserToken } from '../types/UserToken';
import { ResourceError, ResourceErrorReason } from '../errors';
import { getRating } from '../ratings/RatingsInteractor';

/**
 * Checks if a user has the authority to flag a rating
 *
 * @export
 * @typedef {Object} params
 * @property {UserToken} user UserToken object
 * @property {string} ratingId id of specified rating
 *
 * @returns Promise<boolean>
 */
export async function hasFlagCreateAccess(params: {
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    return !(
        await isRatingAuthor({
            user: params.user,
            ratingId: params.ratingId,
        })
    );
}

/**
 * Checks if a user is author of a given rating
 *
 * @export
 * @typedef {Object} params
 * @property {UserToken} user UserToken object
 * @property {string} ratingId id of specified rating
 *
 * @returns Promise<boolean>
 */
async function isRatingAuthor(params: {
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    try {
        const rating = await getRating({
            ratingId: params.ratingId,
        });
        return rating.user.username === params.user.username;
    } catch (error) {
        return Promise.reject(
            new ResourceError(
                'User is not author of the specified rating',
                ResourceErrorReason.INVALID_ACCESS,
            ),
        );
    }
}

export async function hasPrivilegedAccess(params: {
    user: UserToken;
}): Promise<boolean> {
    return params.user.accessGroups.includes('admin') || params.user.accessGroups.includes('editor');
}
