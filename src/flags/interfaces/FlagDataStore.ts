import { Flag } from '../../types/Rating';

export interface FlagDataStore {
    flagRating(ratingId: string, flag: Flag): Promise<void>;
    getAllFlags(): Promise<Flag[]>;
    getUserFlags(username: string): Promise<Flag[]>;
    getLearningObjectFlags(
        learningObjectId: string,
    ): Promise<Flag[]>;
    getRatingFlags(
        ratingId: string,
    ): Promise<Flag[]>;
    deleteFlag(
        flagId: string,
    ): Promise<void>;
}
