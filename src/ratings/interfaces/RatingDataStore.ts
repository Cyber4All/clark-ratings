import { Rating, LearningObjectContainer } from '../../types/Rating';

export interface RatingDataStore {
    updateRating(params: {
        ratingId: string;
        updates: Rating;
    }): Promise<void>;
    deleteRating(params: {
        ratingId: string;
    }): Promise<void>;
    getRating(params: {
        ratingId: string;
    }): Promise<Rating>;
    getLearningObjectsRatings(params: {
        learningObjectId: string;
    }): Promise<LearningObjectContainer>;
    createNewRating(params: {
        rating: Rating;
        learningObjectId: string;
        username: string;
        email: string;
        name: string;
    }): Promise<void>;
}
