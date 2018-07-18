
import { DataStore } from '../interfaces/DataStore';
import { Rating } from '../types/Rating';
import { MongoClient, Db, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
import { User } from '../../node_modules/@cyber4all/clark-entity';

dotenv.config();

export class Collections {
    static ratings: string = 'ratings';
    static objects: string = 'objects';
    static users:   string = 'users';
}

export class MongoDriver implements DataStore {
    private db: Db;
    
    constructor() {
        let dburi =
        process.env.NODE_ENV === 'production'
          ? process.env.CLARK_DB_URI.replace(
              /<DB_PASSWORD>/g,
              process.env.CLARK_DB_PWD
            )
              .replace(/<DB_PORT>/g, process.env.CLARK_DB_PORT)
              .replace(/<DB_NAME>/g, process.env.CLARK_DB_NAME)
          : process.env.CLARK_DB_URI_DEV.replace(
              /<DB_PASSWORD>/g,
              process.env.CLARK_DB_PWD
            )
              .replace(/<DB_PORT>/g, process.env.CLARK_DB_PORT)
              .replace(/<DB_NAME>/g, process.env.CLARK_DB_NAME);
        this.connect(dburi);
    }

    async connect(dbURI: string, retryAttempt?: number): Promise<void> {
        try {
          this.db = await MongoClient.connect(dbURI);
        } catch (e) {
          if (!retryAttempt) {
            this.connect(
              dbURI,
              1
            );
          } else {
            return Promise.reject(
              'Problem connecting to database at ' + dbURI + ':\n\t' + e
            );
          }
        }
      }

    async updateRating(ratingId: string, editRating: Rating): Promise<void> {
        try {
            await this.db.collection(Collections.ratings).update(
                { _id: ratingId },
                {
                  $set: editRating
                }
              );
        } catch (error) {
            return Promise.reject('Error updating rating with specified id!');
        }
    }

    async deleteRating(ratingId: string): Promise<void> {
        try { 
            await this.db.collection(Collections.ratings).deleteOne(
                { _id : ratingId }
            );
        } catch (error) {
            return Promise.reject('Error removing rating with specified id!');
        }
    }

    getRating(ratingId: string): Promise<Rating> {
        try {
            return this.db.collection(Collections.ratings).findOne({ _id: ratingId}).then(rating => {
                if (rating) {
                    return rating;
                } else {
                    return Promise.reject('Error retrieving rating with specified id!');
                }
            })
        } catch (error) {
            return Promise.reject('Problem retrieving rating! Error: ' + error);
        }
    }

    async getUsersRatings(username: string): Promise<Rating[]> {
        try {
            // Get user id from username
            const user = await this.db.collection(Collections.users)
                .findOne( {username: username} );
            const userId = user._id;

            // Find all ratings that have this username id
            const ratings  = await this.db.collection(Collections.ratings)
                .find( {user: userId} )
                .toArray();
            return ratings;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getLearningObjectsRatings(learningObjectName: string): Promise<Rating[]> {
        try {
            // Get learning object id from name 
            const learningObject = await this.db.collection(Collections.objects)
                .findOne( {name: learningObjectName} );
            const learningObjectId = learningObject._id;

            // Find all ratings that have this learning object id 
            const ratings= await this.db.collection(Collections.ratings)
                .find( {learningObject: learningObjectId} )
                .toArray();
            return ratings;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async createNewRating(
        rating: Rating, 
        learningObjectName: string, 
        username: string
    ): Promise<void>{
        try {
            // Get learning object id from name 
            const learningObject = await this.db.collection(Collections.objects)
                .findOne( {name: learningObjectName} );
            const learningObjectId = learningObject._id;

            // Get user id from username 
            const user = await this.db.collection(Collections.users)
                .findOne( {username: username} );
            const userId = user._id;

            // Append both ids to rating object
            rating.learningObject = learningObjectId;
            rating.user = userId;
            
            // Insert new rating object as a document
            rating._id = new ObjectId().toHexString();
            await this.db.collection(Collections.ratings).insert(rating);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // Because the id of user is not on the jwt user object,
    // we need to populate the user of the rating in order to 
    // check author status.
    async getPopulatedReviewAuthor(
        authorId: string
    ): Promise<User> {
        try {
            // Get user object from id
            const user = await this.db.collection(Collections.users)
                .findOne( {_id: authorId } );
            return user;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}