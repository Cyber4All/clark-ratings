import { Flag, Rating, LearningObjectContainer } from '../types/Rating';

export interface DataStore {
    flagRating(
        ratingId: string, flag: Flag,
    ): Promise<void>;
    getAllFlags(): Promise<Flag[]>;
    getUserFlags(
        username: string,
    ): Promise<Flag[]>;
    getLearningObjectFlags(
        learningObjectId: string,
    ): Promise<Flag[]>;
    getRatingFlags(
        ratingId: string,
    ): Promise<Flag[]>;
    deleteFlag(
        flagId: string,
    ): Promise<void>;
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

