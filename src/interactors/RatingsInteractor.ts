import { DataStore, Responder } from "../interfaces/interfaces";


export class RatingsInteractor {

    /**
     * Retrieves a single rating by ID
     * @param dataStore instance of DataStore
     * @param responder instance of Responder
     * @param id of the rating to be retrieved
     */
    async getRating(dataStore: DataStore, responder: Responder, id: string): Promise<void> {
        try {
            let rating = await dataStore.getRating(id);
            responder.sendRatings(rating);
        } catch (error) {
            responder.sendOperationError(error)
        }
    }
}