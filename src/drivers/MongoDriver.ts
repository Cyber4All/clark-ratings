
import { DataStore } from '../interfaces/DataStore';
import { Rating } from '../types/Rating';
import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

export class Collections {
    static ratings: string = 'ratings';
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

    createRating(learningObjectId: string, rating: Rating): Promise<void> {
        throw new Error('not yet implemented');
    }

    updateRating(ratingId: string, rating: Rating): Promise<void> {
        throw new Error('not yet implemented');
    }

    deleteRating(ratingId: string): Promise<void> {
        throw new Error('not yet implemented');
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

    getUsersRatings(userId: string): Promise<Rating[]> {
        throw new Error('not yet implemented');
    }

    getLearningObjectsRatings(learningObjectId: string): Promise<Rating[]> {
        throw new Error('not yet implemented');
    }
}