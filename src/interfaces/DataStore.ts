import { LearningObjectContainer, Rating, Flag } from '../types/Rating';

export interface DataStore {
    updateRating(ratingId: string, updatedRating: Rating): Promise<void>;
    deleteRating(ratingId: string, learningObjectName: string, learningObjectAuthor: string): Promise<void>

    getRating(ratingId: string): Promise<Rating>;
    getLearningObjectsRatings(learningObjectId: string): Promise<LearningObjectContainer>;
    createNewRating(rating: Rating, learningObjectName: string, learningObjectAuthor: string, username: string, email: string, name: string): Promise<void>;
    flagRating(ratingId: string, flag: Flag);
    getAllFlags();
    getUserFlags(username: string);
    getLearningObjectFlags(learningObjectName: string, learningObjectAuthor: string);
    getRatingFlags(learningObjectName: string, learningObjectAuthor: string, ratingId: string);
    deleteFlag(learningObjectName, learningObjectAuthor, ratingId, flagId);
}
