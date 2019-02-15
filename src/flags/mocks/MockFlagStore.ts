import { FlagDataStore } from '../interfaces/FlagDataStore';
import { Flag } from '../../types/Flag';
import { MOCK_OBJECTS } from './MockObjects';

export class MockFlagStore implements FlagDataStore {
    flagRating(ratingId: string, flag: Flag): Promise<void> {
        return Promise.resolve();
    }
    getAllFlags(): Promise<Flag[]> {
        return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }
    getUserFlags(username: string): Promise<Flag[]> {
       return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }
    getLearningObjectFlags(learningObjectId: string): Promise<Flag[]> {
        return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }
    getRatingFlags(ratingId: string): Promise<Flag[]> {
        return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }
    deleteFlag(flagId: string): Promise<void> {
        return Promise.resolve();
    }
}
