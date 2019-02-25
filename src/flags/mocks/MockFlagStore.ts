import { FlagDataStore } from '../interfaces/FlagDataStore';
import { Flag } from '../../types/Flag';
import { MOCK_OBJECTS } from './MockObjects';

export class MockFlagStore implements FlagDataStore {
    flagRating(params: {
        ratingId: string;
        flag: Flag;
    }): Promise<void> {
        return Promise.resolve();
    }
    getAllFlags(): Promise<Flag[]> {
        return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }
    getUserFlags(params: {
        username: string,
    }): Promise<Flag[]> {
       return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }
    getLearningObjectFlags(params: {
        learningObjectId: string;
    }): Promise<Flag[]> {
        return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }
    getRatingFlags(params: {
        ratingId: string;
    }): Promise<Flag[]> {
        return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }
    deleteFlag(params: {
        flagId: string;
    }): Promise<void> {
        return Promise.resolve();
    }
}
