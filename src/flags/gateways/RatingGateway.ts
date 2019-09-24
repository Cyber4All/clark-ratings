import { getRating as fetchRating } from '../../ratings/RatingsInteractor';

/**
 * Grabs a rating object
 * @param ratingID the ID of the rating that is getting grabbed
 */
export async function getRating(ratingID: string) {
    return await fetchRating({
        ratingID,
    });
}
