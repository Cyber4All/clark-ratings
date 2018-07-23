import { Rating } from '../types/Rating';
import { User } from '../../node_modules/@cyber4all/clark-entity';

export interface DataStore {
    updateRating(ratingId: string, editRating: Rating): Promise<void>;
    deleteRating(ratingId: string, learningObjectName: string): Promise<void>

    getRating(ratingId: string): Promise<Rating>;
    getUsersRatings(userId: string): Promise<Rating[]>;
    getLearningObjectsRatings(learningObjectId: string): Promise<Rating[]>;
    createNewRating(rating: Rating, learningObjectName: string, username: string): Promise<void>;
}
