import { RatingDataStore } from '../interfaces/RatingDataStore';
import { Rating } from '../../types/Rating';
import { MOCK_OBJECTS } from './MockObjects';

export class MockRatingStore implements RatingDataStore {
    updateRating(params: { ratingId: string; updates: Rating; }): Promise<void> {
        return Promise.resolve();
    }
    deleteRating(params: { ratingId: string; }): Promise<void> {
        return Promise.resolve();
    }
    getRating(params: { ratingId: string; }): Promise<Rating> {
        return Promise.resolve(MOCK_OBJECTS.RATING);
    }
    getLearningObjectsRatings(params: { learningObjectId: string; }): Promise<Rating[]> {
        return Promise.resolve([MOCK_OBJECTS.RATING]);
    }
    createNewRating(params: { rating: Rating}): Promise<void> {
        return Promise.resolve();
    }
    getUsersRatings(params: { username: string; }): Promise<Rating[]> {
        return Promise.resolve([MOCK_OBJECTS.RATING]);
    }
}
