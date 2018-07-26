
import { DataStore } from '../interfaces/DataStore';
import { Rating, LearningObjectContainer, Flag } from '../types/Rating';
import { MongoClient, Db, ObjectId, Timestamp } from 'mongodb';
import * as request from 'request-promise';
import * as dotenv from 'dotenv';
import { generateServiceToken } from './TokenManager';
import { LEARNING_OBJECT_SERVICE_ROUTES } from '../routes';
dotenv.config();

export class Collections {
    static ratings: string = 'ratings';
    static objects: string = 'objects';
    static users:   string = 'users';
    static flags:   string = 'flags';
}

export class MongoDriver implements DataStore {
    private db: Db;

    private options = {
        uri: '',
        json: true,
        headers: {
          Authorization: 'Bearer'
        }
      };
    
    constructor(dburi: string) {
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
     /**
   * Close the database. Note that this will affect all services
   * and scripts using the database, so only do this if it's very
   * important or if you are sure that *everything* is finished.
   */
  disconnect(): void {
    this.db.close();
  }

    async updateRating(
        ratingId:             string, 
        learningObjectName:   string,
        learningObjectAuthor: string,
        editRating:           Rating
    ): Promise<void> {
        try {
            // Get learning object id from name 
            const learningObjectId = await this.getLearningObjectId(learningObjectName, learningObjectAuthor);
            const ratings = await this.getLearningObjectsRatings(learningObjectName, learningObjectAuthor);
            const index = ratings['ratings'].map(function(e) { return e._id; }).indexOf(ratingId);
            ratings['ratings'][index].number = editRating.number;
            ratings['ratings'][index].comment = editRating.comment;
            const average = await this.findAvgRating(ratings['ratings']);
            ratings['avgRating'] = average;
            await this.db.collection(Collections.ratings).update(
                { "learningObjectId" : learningObjectId, "ratings._id": ratingId },
                {
                  $set: ratings
                }
              );
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async deleteRating(
        ratingId:             string,
        learningObjectName:   string,
        learningObjectAuthor: string
    ): Promise<void> {
        try { 
            // Get learning object id from name 
            let average: number;
            const learningObjectId = await this.getLearningObjectId(learningObjectName, learningObjectAuthor);
            const ratings = await this.getLearningObjectsRatings(learningObjectName, learningObjectAuthor);
            const index = ratings['ratings'].map(function(e) { return e._id; }).indexOf(ratingId);
            ratings['ratings'].splice(index, 1);
            // Prevent avgRating from being NaN
            if(ratings['ratings'].length > 0) {
                average = await this.findAvgRating(ratings['ratings']);
            } else {
                average = 0;
            }
            ratings['avgRating'] = average;
            await this.db.collection(Collections.ratings).update(
                { "learningObjectId" : learningObjectId },
                { $set: ratings }
            );

            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
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
        learningObjectName:   string,
        learningObjectAuthor: string
    ): Promise<Rating[]> {
        try {
            // Get learning object id from name 
            const learningObjectId = await this.getLearningObjectId(learningObjectName, learningObjectAuthor);
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
        rating:               Rating, 
        learningObjectName:   string, 
        learningObjectAuthor: string,
        username:             string,
        email:                string,
        name:                 string
    ): Promise<void> {
        try {
            // Get learning object id from name 
            const learningObjectId = await this.getLearningObjectId(learningObjectName, learningObjectAuthor);
            // Append id to rating object
            rating.user = { name: name, username: username, email: email };
            rating._id   = new ObjectId().toHexString();
            rating.date  = rating._id.toString().substring(0,8);
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
            }
            return Promise.resolve();
        } catch(error) {
            return Promise.reject(error);
        }
    }

    async flagRating(
        ratingId:             string,
        flag:                 Flag 
    ): Promise<void> {
        try {
            flag.ratingId = ratingId;
            flag._id   = new ObjectId().toHexString();
            flag.date  = flag._id.toString().substring(0,8);
            await this.db.collection(Collections.flags).insert(flag);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private async getLearningObjectId(learningObjectName: string, learningObjectAuthor: string) {
            try {
              this.options.uri = LEARNING_OBJECT_SERVICE_ROUTES.GET_ID(
                learningObjectAuthor,
                learningObjectName
              );
              this.options.headers.Authorization = `Bearer ${generateServiceToken()}`;
              return request(this.options);
            } catch (e) {
              return Promise.reject(`Problem reading Learning Object. Error: ${e}`);
            }
            // try {
            //     const learningObject = await this.db.collection(Collections.objects).findOne({'name': learningObjectName});
            //     const learningObjectId = learningObject._id;
            //     return learningObjectId;
            // } catch (error) {
            //     return Promise.reject(error);
            // }
    }

    /**
     * Helper method for averaging all of the ratings for a specfied learning 
     * object and appending the value to a learning object
     * @param learningObjectName name of learning object to find average score
     * @param newRatingNumber number of incoming rating object
     */
    private findAvgRating(
        learningObjectRatings
    ) {
        const numbers = learningObjectRatings.map(x => x.number);
        const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        const result = average( numbers );
        return result;
    }
}