
import { DataStore } from '../interfaces/DataStore';
import { Rating, LearningObjectContainer } from '../types/Rating';
import { MongoClient, Db, ObjectId, Timestamp } from 'mongodb';
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

    async connect(
        dbURI:         string, 
        retryAttempt?: number
    ): Promise<void> {
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

    async updateRating(
        ratingId:   string, 
        editRating: Rating
    ): Promise<void> {
        try {
            await this.db.collection(Collections.ratings).update(
                { _id: ratingId },
                {
                  $set: editRating
                }
              );
            return Promise.resolve();
        } catch (error) {
            return Promise.reject('Error updating rating with specified id!');
        }
    }

    async deleteRating(
        ratingId:           string,
        learningObjectName: string
    ): Promise<void> {
        try { 
            // Get learning object id from name 
            const learningObject = await this.db.collection(Collections.objects)
                .findOne( {name: learningObjectName} );
            const learningObjectId = learningObject._id;

            console.log(learningObjectId);

            await this.db.collection(Collections.ratings).update(
                { "learningObjectId" : learningObjectId },
                { $pull: { "ratings" : { _id: ratingId } } },
            );

            return Promise.resolve();
        } catch (error) {
            return Promise.reject('Error removing rating with specified id!');
        }
    }

    async getRating(
        ratingId: string
    ): Promise<Rating> {
        try {
            const rating = await this.db.collection(Collections.ratings).aggregate(
                [
                    {$match: {'ratings._id': ratingId }},
                    {$project: {
                        ratings: {$filter: {
                            input: '$ratings',
                            as: 'rating',
                            cond: {$eq: ['$$rating._id', ratingId ]}
                        }},
                        _id: 0
                    }}
                ]
            ).toArray();
            return rating[0].ratings[0];
        } catch (error) {
            return Promise.reject('Problem retrieving rating! Error: ' + error);
        }
    }

    async getUsersRatings(
        username: string
    ): Promise<Rating[]> {
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

    async getLearningObjectsRatings(
        learningObjectName: string
    ): Promise<Rating[]> {
        try {
            // Get learning object id from name 
            const learningObject = await this.db.collection(Collections.objects)
                .findOne( {name: learningObjectName} );
            const learningObjectId = learningObject._id;
            
            // Find all ratings that contain the learningObjectId and populate the user 
            // field for each document
            const rating = await this.db.collection(Collections.ratings).aggregate([
                { $match: { learningObjectId: learningObjectId } }
            ]).toArray();

            return rating[0];
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async createNewRating(
        rating:             Rating, 
        learningObjectName: string, 
        username:           string
    ): Promise<void>{
        try {
            // Get learning object id from name 
            const learningObject = await this.db.collection(Collections.objects)
                .findOne( {name: learningObjectName} );
            const learningObjectId = learningObject._id;

            // Get user email from username 
            const user = await this.db.collection(Collections.users)
                .findOne( {username: username} );
            const email = user.email;

            // Append id to rating object
            rating.user = { username: username, email: email };
            // FIXME - add correct date 
            rating.date = new Timestamp(1412180887, 1).toString();
            rating._id = new ObjectId().toHexString();

            // Is this learning object already in the ratings collection?
            const learningObjectStored = await this.db.collection(Collections.ratings)
                .find( {learningObjectId: learningObjectId} ).limit(1).toArray();
           
            // If learning object is found, append rating to it and calculate avg rating
            if (learningObjectStored.length > 0) {
                learningObjectStored[0].ratings.push(rating);
                const average = this.findAvgRating(learningObjectStored[0].ratings);
                learningObjectStored[0].avgRating = average;
                
                await this.db.collection(Collections.ratings).update(
                    { learningObjectId: learningObjectId },
                    {
                      $set: learningObjectStored[0]
                    }
                );
                return Promise.resolve();
            } else {
                const learningObjectContainer: LearningObjectContainer = {
                    _id: new ObjectId().toHexString(),
                    learningObjectId: learningObjectId,
                    avgRating: rating.number, // No need to calculate average for first rating
                    ratings: [
                        rating
                    ]
                }

                // Insert new learningObjectContainer as a document
                await this.db.collection(Collections.ratings).insert(learningObjectContainer);
                return Promise.resolve();
            }
        } catch(error) {
            return Promise.reject(error);
        }
    
    }

    /**
     * Helper method for averaging all of the ratings for a specfied learning 
     * object and appending the value to a learning object
     * @param learningObjectName name of learning object to find average score
     * @param newRatingNumber number of incoming rating object
     */
    findAvgRating(
        learningObjectRatings
    ) {
        const numbers = learningObjectRatings.map(x => x.number);
        const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        const result = average( numbers );
        return result;
    }
}