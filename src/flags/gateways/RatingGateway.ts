import { getRating as fetchRating } from '../../ratings/RatingsInteractor';

/**
 * Grabs a rating object
 * @param ratingId the id of the rating that is getting grabbed
 */
export async function getRating(ratingId: string) {
    return await fetchRating({
        ratingId,
    });
}
