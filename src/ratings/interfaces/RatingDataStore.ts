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
        CUID: string;
    }): Promise<any>;
    createNewRating(params: {
        rating: Rating;
        CUID: string;
        user: UserInfo;
    }): Promise<void>;
}
