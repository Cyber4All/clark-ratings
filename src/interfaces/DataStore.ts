import { Rating, Flag } from '../types/Rating';
import { User } from '../../node_modules/@cyber4all/clark-entity';

export interface DataStore {
    updateRating(ratingId: string, learningObjectName: string, learningObjectAuthor: string, editRating: Rating): Promise<void>;
    deleteRating(ratingId: string, learningObjectName: string, learningObjectAuthor: string): Promise<void>

    getRating(ratingId: string): Promise<Rating>;
    getUsersRatings(userId: string): Promise<Rating[]>;
    getLearningObjectsRatings(learningObjectName: string, learningObjectAuthor: string): Promise<Rating[]>;
    createNewRating(rating: Rating, learningObjectName: string, learningObjectAuthor: string, username: string, email: string, name: string): Promise<void>;
    flagRating(ratingId: string, flag: Flag);
}
