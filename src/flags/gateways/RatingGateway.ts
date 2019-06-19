import { getRating as fetchRating } from '../../ratings/RatingsInteractor';

export async function getRating(ratingId: string) {
    return await fetchRating({
        ratingId,
    });
}
