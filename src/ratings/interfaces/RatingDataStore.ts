import { Rating, LearningObjectContainer } from '../../types/Rating';

export interface RatingDataStore {
    updateRating(
        ratingId: string,
        updatedRating: Rating,
    ): Promise<void>;
    deleteRating(
        ratingId: string,
    ): Promise<void>;
    getRating(
        ratingId: string,
    ): Promise<Rating>;
    getLearningObjectsRatings(
        learningObjectId: string,
    ): Promise<LearningObjectContainer>;
    createNewRating(
        rating: Rating,
        learningObjectId: string,
        username: string,
        email: string,
        name: string,
    ): Promise<void>;
}
