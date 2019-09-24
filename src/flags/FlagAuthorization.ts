import { UserToken } from '../types/UserToken';
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
    ratingID: string;
}): Promise<boolean> {
    const isAuthor = await isRatingAuthor({
        user: params.user,
        ratingID: params.ratingID,
    });
    // Rating author cannot flag their own rating
    const hasCreateAccess = !isAuthor;
    return hasCreateAccess;
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
    ratingID: string;
}): Promise<boolean> {
    const rating = await getRating({
        ratingID: params.ratingID,
    });
    return rating.user.username === params.user.username;
}

export async function hasPrivilegedAccess(params: {
    user: UserToken;
}): Promise<boolean> {
    return params.user.accessGroups.includes('admin') || params.user.accessGroups.includes('editor');
}
