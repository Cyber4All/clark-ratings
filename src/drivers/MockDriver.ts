import { DataStore } from '../interfaces/DataStore';
import { Rating, Flag } from '../types/Rating';
import { MOCK_OBJECTS } from '../../tests/mocks';

export class MockDriver implements DataStore {

    constructor() {
        
    }

    updateRating(
        ratingId: string, 
        learningObjectName: string, 
        learningObjectAuthor: string, 
        editRating: Rating
    ): Promise<void> {
        return Promise.resolve();
    }

    deleteRating(
        ratingId: string, 
        learningObjectName: string, 
        learningObjectAuthor: string
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
        learningObjectName: string, 
        learningObjectAuthor: string
    ): Promise<Rating[]> {
       return Promise.resolve([MOCK_OBJECTS.RATING]);
    }
    
    createNewRating(
        rating: Rating, 
        learningObjectName: string, 
        learningObjectAuthor: string, 
        username: string, 
        email: string, 
        name: string
    ): Promise<void> {
        return Promise.resolve();
    }
    
    flagRating(
        ratingId: string, 
        flag: Flag
    ):Promise<void> {
       return Promise.resolve();
    }
    
    getAllFlags():Promise<Flag[]> {
       return Promise.resolve([MOCK_OBJECTS.CYPRESS_FLAG, MOCK_OBJECTS.FLAG]);
    }
    
    getUserFlags(
        username: string
    ):Promise<Flag[]> {
       return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }
    
    getLearningObjectFlags(
        learningObjectName: string, 
        learningObjectAuthor: string
    ):Promise<Flag[]> {
       return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }
    
    getRatingFlags(
        learningObjectName: string, 
        learningObjectAuthor: string, 
        ratingId: string
    ):Promise<Flag[]> {
       return Promise.resolve([MOCK_OBJECTS.FLAG]);
    }
    
    deleteFlag(
        learningObjectName: any, 
        learningObjectAuthor: any, 
        ratingId: any,
        flagId: any
    ):Promise<void> {
      return Promise.resolve();  
    }
}