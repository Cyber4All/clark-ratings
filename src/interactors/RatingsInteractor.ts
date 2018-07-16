import { DataStore, Responder } from "../interfaces/interfaces";
import { Rating } from "../types/Rating";


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

    /**
     * Retrieves a single rating by ID
     * @param dataStore instance of DataStore
     * @param responder instance of Responder
     * @param id of the rating to be retrieved
     * @param rating object containing edits
     */
    async updateRating(dataStore: DataStore, responder: Responder, id: string, rating: Rating): Promise<void> {
        try {
            await dataStore.updateRating(id, rating);
            responder.sendOperationSuccess();
        } catch (error) {
            responder.sendOperationError(error)
        }
    }

     /**
     * Retrieves a single rating by ID
     * @param dataStore instance of DataStore
     * @param responder instance of Responder
     * @param id of the rating to be retrieved
     */
    async deleteRating(dataStore: DataStore, responder: Responder, id: string): Promise<void> {
        try {
            let rating = await dataStore.getRating(id);
            responder.sendRatings(rating);
        } catch (error) {
            responder.sendOperationError(error)
        }
    }
}