import { DataStore } from "../interfaces/interfaces";
import { Rating } from "../types/Rating";
import { User } from "../../node_modules/@cyber4all/clark-entity";


export class RatingsInteractor {

    /**
     * Retrieves a single rating by ID
     * @param dataStore instance of DataStore
     * @param ratingId of the rating to be retrieved
     */
    async getRating(
        dataStore: DataStore, 
        ratingId:  string
    ): Promise<Rating> {
        try {
            let rating = await dataStore.getRating(ratingId);
            return rating;
        } catch (error) {
            return Promise.reject('Error getting rating with specified id!');
        }
    }

    /**
     * Updates a single rating
     * @param dataStore instance of DataStore
     * @param id of the rating to be retrieved
     * @param editRating object containing edits
     * @param currentUser object containing information of user that made request
     */
    async updateRating(
        dataStore:   DataStore, 
        ratingId:    string, 
        editRating:  Rating,
        currentUser: User
    ): Promise<void> {
        try {
            const isAuthor = await this.checkAuthor(currentUser, ratingId, dataStore);
            if (isAuthor) {
                await dataStore.updateRating(ratingId, editRating);
            } else {
                return Promise.reject(new Error('Error! Current user is not the author of this review!'));
            }
        } catch (error) {
            return Promise.reject('Error updating rating with specified id!');
        }
    }

     /**
     * Deletes a single rating
     * @param dataStore instance of DataStore
     * @param ratingId of the rating to be retrieved
     * @param currentUser object containing information of user that made request
     */
    async deleteRating(
        dataStore:   DataStore, 
        ratingId:    string, 
        currentUser: User
    ): Promise<void> {
        try {
            const isAuthor = await this.checkAuthor(currentUser, ratingId, dataStore);
            if(isAuthor) {
                await dataStore.deleteRating(ratingId);
            } else {
                return Promise.reject(new Error('Error! Current user is not the author of this review!'));
            }
        } catch (error) {
            return Promise.reject('Error deleting rating with specified id!');
        }
    }

    /**
     * Get all ratings for a specified learning object
     * @param dataStore instance of DataStore
     * @param learningObjectName name of learning object
     */
    async getLearningObjectRatings(
        dataStore:          DataStore, 
        learningObjectName: string
    ): Promise <Rating[]> {
        try {
            const ratings = await dataStore.getLearningObjectsRatings(learningObjectName);
            return ratings;
        } catch (erorr) {
            return Promise.reject('Error getting ratings for specified learning object!');
        }
    }

    /**
     * Create a new rating
     * @param dataStore instance of DataStore
     * @param rating object containing new rating information
     * @param learningObjectName name of learning object
     * @param username username to be appended to new rating document
     */
    async createNewRating(
        dataStore:          DataStore, 
        rating:             Rating, 
        learningObjectName: string, 
        username:           string
    ): Promise<void> {
        try {
            await dataStore.createNewRating(rating, learningObjectName, username);
        } catch (error) {
            return Promise.reject('Error creating new rating!');
        }
    }

    /**
     * Get all ratings for a specified user
     * @param dataStore instance of DataStore
     * @param username username to search with
     */
    async getUsersRatings(
        dataStore: DataStore,
        username:  string
    ): Promise<Rating[]> {
        try {
            const ratings =  await dataStore.getUsersRatings(username);
            console.log(ratings);
            return ratings;
        } catch (error) {
            return Promise.reject('Error finding ratings for specified user!');
        }
    }

    /**
     * Helper method used to determine if the current user is the author
     * of a specified review
     * @param currentUser user object of current user
     * @param ratingId id of a rating object
     * @param dataStore instance of DataStore
     */
    private async checkAuthor(
        currentUser: User,
        ratingId:    string,
        dataStore:   DataStore
    ): Promise<boolean> {
        let isAuthor: boolean = false;
        try {
            // Get rating object 
            const rating: Rating = await dataStore.getRating(ratingId);

            // Get populated user object 
            const populatedUser = await dataStore.getPopulatedReviewAuthor(rating.user);

            // Compare current user and specified rating author
            if (populatedUser.username === currentUser.username) {
                isAuthor = true;
            }

            return isAuthor;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}