import { Rating } from '../types/Rating';

export interface DataStore {
    createRating(learningObjectId: string, rating: Rating): Promise<void>;
    updateRating(ratingId: string, rating: Rating): Promise<void>;
    deleteRating(ratingId: string): Promise<void>

    getRating(ratingId: string): Promise<Rating>;
    getUsersRatings(userId: string): Promise<Rating[]>;
    getLearningObjectsRatings(learningObjectId: string): Promise<Rating[]>;
}
