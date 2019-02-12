import { DataStore } from '../interfaces/interfaces';
import { Rating, Flag, LearningObjectContainer } from '../types/Rating';
import { MOCK_OBJECTS } from '../tests/mocks';

export class MockDriver implements DataStore {

    updateRating(
        ratingId: string,
        editRating: Rating,
    ): Promise<void> {
        return Promise.resolve();
    }

    deleteRating(
        ratingId: string,
    ): Promise<void> {
       return Promise.resolve();
    }

    getRating(ratingId: string): Promise<Rating> {
        return Promise.resolve(MOCK_OBJECTS.RATING);
    }

    getUsersRatings(username: string): Promise<Rating[]> {
        return Promise.resolve([MOCK_OBJECTS.RATING]);
    }

    getLearningObjectsRatings(
        learningObjectId: string,
    ): Promise<LearningObjectContainer> {
       return Promise.resolve(MOCK_OBJECTS.CONTAINER);
    }

    createNewRating(
        rating: Rating,
        learningObjectId: string,
        username: string,
        email: string,
        name: string,
    ): Promise<void> {
        return Promise.resolve();
    }

    flagRating(
        ratingId: string,
        flag: Flag,
    ): Promise<void> {
       return Promise.resolve();
    }

    getAllFlags(): Promise<Flag[]> {
       return Promise.resolve([MOCK_OBJECTS.CYPRESS_FLAG, MOCK_OBJECTS.FLAG]);
    }

    getUserFlags(
        username: string,
    ): Promise<Flag[]> {
       return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }

    getLearningObjectFlags(
        learningObjectId: string,
    ): Promise<Flag[]> {
       return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }

    getRatingFlags(
        ratingId: string,
    ): Promise<Flag[]> {
       return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }

    deleteFlag(
        flagId: string,
    ): Promise<void> {
      return Promise.resolve();
    }
}
