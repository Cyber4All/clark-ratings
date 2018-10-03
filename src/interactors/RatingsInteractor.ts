import { DataStore } from "../interfaces/interfaces";
import { LearningObjectContainer, Rating, Flag } from "../types/Rating";
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
            return Promise.reject(`Problem getting rating. Error: ${error}`);
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
        dataStore:            DataStore, 
        ratingId:             string, 
        learningObjectName:   string,
        learningObjectAuthor: string,
        editRating:           Rating,
        currentUsername:      string
    ): Promise<void> {
        try {
            const isRatingAuthor = await this.checkRatingAuthor(currentUsername, ratingId, dataStore);
            if (isRatingAuthor) {
                await dataStore.updateRating(ratingId, learningObjectName, learningObjectAuthor, editRating);
            } else {
                return Promise.reject('Error! Current user is not the author of this review!');
            }
        } catch (error) {
            return Promise.reject(`Problem updating rating. Error: ${error}`);
        }
    }

     /**
     * Deletes a single rating
     * @param dataStore instance of DataStore
     * @param ratingId of the rating to be retrieved
     * @param currentUser object containing information of user that made request
     */
    async deleteRating(
        dataStore:            DataStore, 
        ratingId:             string, 
        learningObjectName:   string,
        learningObjectAuthor: string,
        currentUsername:      string
    ): Promise<void> {
        try {
            const isRatingAuthor = await this.checkRatingAuthor(currentUsername, ratingId, dataStore);
            if(isRatingAuthor) {
                await dataStore.deleteRating(ratingId, learningObjectName, learningObjectAuthor);
            } else {
                return Promise.reject('Error! Current user is not the author of this review!');
            }
        } catch (error) {
            return Promise.reject(`Problem deleting rating. Error: ${error}`);
        }
    }

    /**
     * Get all ratings for a specified learning object
     * @param dataStore instance of DataStore
     * @param learningObjectName name of learning object
     */
    async getLearningObjectRatings(
        dataStore:            DataStore, 
        learningObjectName:   string,
        learningObjectAuthor: string
    ): Promise <LearningObjectContainer> {
        try {
            const ratings = await dataStore.getLearningObjectsRatings(learningObjectName, learningObjectAuthor);
            return ratings;
        } catch (error) {
            return Promise.reject(`Problem getting learning object ratings. Error: ${error}`);
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
        dataStore:            DataStore, 
        rating:               Rating, 
        learningObjectName:   string, 
        learningObjectAuthor: string,
        username:             string,
        email:                string,
        name:                 string
    ): Promise<void> {
        try {
            await dataStore.createNewRating(rating, learningObjectName, learningObjectAuthor, username, email, name);
        } catch (error) {
            return Promise.reject(`Problem creating new rating. Error: ${error}`);
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
            return ratings;
        } catch (error) {
            return Promise.reject(`Problem getting user ratings. Error ${error}`);
        }
    }

    async flagRating(
        dataStore:            DataStore,
        ratingId:             string,
        currentUsername:      string,
        flag:                 Flag  
    ): Promise<void> {
        try {
            const isRatingAuthor = await this.checkRatingAuthor(currentUsername, ratingId, dataStore);
            if(!isRatingAuthor) {
                await dataStore.flagRating(ratingId, flag);
                return Promise.resolve();
            } else {
                return Promise.reject('Error the author of the rating cannot perform this action!');
            }
        } catch (error) {
            return Promise.reject(`Problem flaging rating. Error: ${error}`);
        }
    }

    /**
     * Helper method used to determine if the current user is the author
     * of a specified review
     * @param currentUser user object of current user
     * @param ratingId id of a rating object
     * @param dataStore instance of DataStore
     */
    private async checkRatingAuthor(
        currentUsername:    string,
        ratingId:           string,
        dataStore:          DataStore
    ): Promise<boolean> {
        let isAuthor: boolean = false;
        try {
            // Get rating object 
            const rating: Rating = await dataStore.getRating(ratingId);

            // Get populated user object 
            const ratingUsername = rating.user.username;

            // Compare current user and specified rating author
            if (ratingUsername === currentUsername) {
                isAuthor = true;
            }

            return isAuthor;
        } catch (error) {
            return Promise.reject(`Probelm checking rating author.  Error: ${error}`);
        }
    }

    private checkLearningObjectAuthor(
        currentUser:          User,
        learningObjectAuthor: string
    ) {
        let isAuthor = false;
        if (currentUser.username === learningObjectAuthor) {
            isAuthor = true;
        }
        return isAuthor;
    }
}