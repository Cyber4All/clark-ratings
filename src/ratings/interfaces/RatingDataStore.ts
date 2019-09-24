import { Rating } from '../../types/Rating';
import { UserInfo } from '../../types/UserInfo';

export interface RatingDataStore {
    updateRating(params: {
        ratingID: string;
        updates: Rating;
    }): Promise<void>;
    deleteRating(params: {
        ratingID: string;
    }): Promise<void>;
    getRating(params: {
        ratingID: string;
    }): Promise<Rating>;
    getLearningObjectsRatings(params: {
        CUID: string;
    }): Promise<any>;
    createNewRating(params: {
        rating: Rating;
        CUID: string;
        versionID: string;
        user: UserInfo;
    }): Promise<void>;
}
