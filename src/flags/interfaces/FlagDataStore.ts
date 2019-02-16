import { Flag } from '../../types/Flag';

export interface FlagDataStore {
    flagRating(params: {
        ratingId: string;
        flag: Flag;
    }): Promise<void>;
    getAllFlags(): Promise<Flag[]>;
    getUserFlags(params: {
        username: string;
    }): Promise<Flag[]>;
    getLearningObjectFlags(params: {
        learningObjectId: string;
    }): Promise<Flag[]>;
    getRatingFlags(params: {
        ratingId: string;
    }): Promise<Flag[]>;
    deleteFlag(params: {
        flagId: string;
    }): Promise<void>;
}
