import { DataStore, Responder } from "../interfaces/interfaces";
import { Rating, RatingIdentifier } from "../types/Rating";
import { User } from "../../node_modules/@cyber4all/clark-entity";


export class RatingsInteractor {

    /**
     * Retrieves a single rating by ID
     * @param dataStore instance of DataStore
     * @param id of the rating to be retrieved
     */
    async getRating(
        dataStore: DataStore, 
        id: string
    ): Promise<Rating> {
        try {
            let rating = await dataStore.getRating(id);
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
     */
    async updateRating(
        dataStore: DataStore, 
        ratingId: string, 
        editRating: Rating,
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
     * Retrieves a single rating by ID
     * @param dataStore instance of DataStore
     * @param id of the rating to be retrieved
     */
    async deleteRating(
        dataStore: DataStore, 
        ratingId: string, 
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

    async getLearningObjectRatings(
        dataStore: DataStore, 
        learningObjectName: string
    ): Promise <Rating[]> {
        try {
            const ratings = await dataStore.getLearningObjectsRatings(learningObjectName);
            return ratings;
        } catch (erorr) {
            return Promise.reject('Error getting ratings for specified learning object!');
        }
    }

    async createNewRating(
        dataStore: DataStore, 
        rating: Rating, 
        learningObjectName: string, 
        username: string
    ): Promise<void> {
        try {
            await dataStore.createNewRating(rating, learningObjectName, username);
        } catch (error) {
            return Promise.reject('Error creating new rating!');
        }
    }

    async getUsersRatings(
        dataStore: DataStore,
        username: string
    ): Promise<Rating[]> {
        try {
            const ratings =  await dataStore.getUsersRatings(username);
            console.log(ratings);
            return ratings;
        } catch (error) {
            return Promise.reject('Error finding ratings for specified user!');
        }
    }

    private async checkAuthor(
        currentUser: User,
        ratingId: string,
        dataStore: DataStore
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