import { DataStore } from '../interfaces/interfaces';
import { Flag } from '../types/Rating';


export class AdminRatingsInteractor {

    async deleteRating(
        dataStore: DataStore,
        learningObjectAuthor: string,
        learningObjectName: string,
        ratingId: string,
    ): Promise<void> {
        try {
            await dataStore.deleteRating(ratingId, learningObjectName, learningObjectAuthor);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(`Problem deleting rating (ADMIN). Error: ${error}`);
        }
    }



    
}
