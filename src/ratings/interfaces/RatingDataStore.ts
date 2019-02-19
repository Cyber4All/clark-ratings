import { Rating } from '../../types/Rating';
import { UserInfo } from '../../types/UserInfo';

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
    }): Promise<any>;
    createNewRating(params: {
        rating: Rating;
        learningObjectId: string;
        user: UserInfo;
    }): Promise<void>;
    getUsersRatings(params: {
        username: string;
    }): Promise<any>;
}
