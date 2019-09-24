import { Flag } from '../../types/Flag';

export interface FlagDataStore {
    flagRating(params: {
        ratingID: string;
        flag: Flag;
    }): Promise<void>;
    getAllFlags(): Promise<Flag[]>;
    getRatingFlags(params: {
        ratingID: string;
    }): Promise<Flag[]>;
    deleteFlag(params: {
        flagID: string;
    }): Promise<void>;
}
