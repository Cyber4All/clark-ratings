import { Rating } from '../types/Rating';
import { reportError } from '../drivers/SentryConnector';
import { RatingDataStore } from './interfaces/RatingDataStore';
import { Db, ObjectID } from 'mongodb';
import { MongoDriver } from '../drivers/MongoDriver';
import { ServiceError, ServiceErrorType } from '../errors';


enum Collections {
  RATINGS = 'ratings',
}

export class RatingStore implements RatingDataStore {
  private static instance: RatingDataStore;
  private db: Db;

  private constructor() {
      this.db = MongoDriver.getConnection();
  }

  static getInstance(): RatingDataStore {
      if (!RatingStore.instance) {
          RatingStore.instance = new RatingStore();
      }
      return RatingStore.instance;
  }

  /**
   * Update a specified rating document
   * @export
   * @param params
   * @property { string } ratingId the id of the parent rating document
   * @property { Rating } updates Rating object that contains updates
   * @returns { Promise<void> }
   */
  async updateRating(params: {
    ratingId: string;
    updates: Rating;
  }): Promise<void> {
      try {
        await this.db.collection(Collections.RATINGS)
          .findOneAndUpdate(
            { _id: new ObjectID(params.ratingId) },
            { $set: {
              value: params.updates.value,
              comment: params.updates.comment, date: Date.now() },
          });
        return Promise.resolve();
      } catch (error) {
        reportError(error);
        return Promise.reject(new ServiceError(
            ServiceErrorType.INTERNAL,
          ),
        );
      }
    }

    /**
     * Delete a specified response document
     * @export
     * @param params
     * @property { string } ratingId the id of the parent rating document
     * @returns { Promise<void> }
     */
    async deleteRating(params: {
      ratingId: string;
    }): Promise<void> {
      try {
        await this.db.collection(Collections.RATINGS)
          .findOneAndDelete({ _id: new ObjectID(params.ratingId) });
      } catch (error) {
        reportError(error);
        return Promise.reject(new ServiceError(
            ServiceErrorType.INTERNAL,
          ),
        );
      }
    }

    /**
     * Fetch a specified response document
     * @export
     * @param params
     * @property { string } ratingId the id of the parent rating document
     * @returns { Promise<Rating> }
     */
    async getRating(params: {
      ratingId: string;
    }): Promise<Rating> {
      try {
        return (await this.db.collection(Collections.RATINGS)
          .find({ _id: new ObjectID(params.ratingId) }).toArray())[0];
      } catch (error) {
        reportError(error);
        return Promise.reject(new ServiceError(
            ServiceErrorType.INTERNAL,
          ),
        );
      }
    }

    /**
     * Fetch all ratings that belong to a learning object
     * @export
     * @param params
     * @property { string } learningObjectId the id of the learning object
     * @returns { Promise<Rating[]> }
     */
    async getLearningObjectsRatings(params: {
      learningObjectId: string;
    }): Promise<Rating[]> {
      try {
        const data = await this.db.collection(Collections.RATINGS)
          .aggregate(
          [
            {
              $match: { source: params.learningObjectId },
            },
            {
              $sort: { date: 1 },
            },
            {
              $group: {
                _id: '$source',
                avgValue: {
                  $avg: '$value',
                },
                ratings: {
                  $push: {
                    _id: '$_id',
                    value: '$value',
                    user: '$user',
                    comment: '$comment',
                    date: '$date',
                  },
                },
              },
            },
          ],
        ).toArray();

        return data[0];
      } catch (error) {
        reportError(error);
        return Promise.reject(new ServiceError(
            ServiceErrorType.INTERNAL,
          ),
        );
      }
    }

    /**
     * Insert a new document into the ratings collection
     * @export
     * @param params
     * @property { Rating } rating the rating object being inserted
     * @property { string } learningObjectId: id of the learning object being reviewed
     * @property { string } username: username of the rating author
     * @property { string } email: email of the rating author
     * @property { string } name: name of the rating author
     *
     * @returns { Promise<Rating> }
     */
    async createNewRating(params: {
      rating: Rating;
      learningObjectId: string;
      username: string;
      email: string;
      name: string;
    }): Promise<void> {
      try {
        await this.db.collection(Collections.RATINGS)
          .insert();
      } catch (error) {
        return Promise.reject(
          new ServiceError(
            ServiceErrorType.INTERNAL,
          ),
        );
      }
    }

    /**
     * Find all ratings that belong to a given user
     * @export
     * @param params
     * @property { string } username: username of the rating author
     *
     * @returns { Promise<Rating> }
     */
    async getUsersRatings(params: {
      username: string;
    }): Promise<Rating[]> {
      try {
        const ratings = await this.db.collection(Collections.RATINGS)
          .find({
            'user.username': params.username,
          })
          .toArray();
        return ratings;
      } catch (error) {
        reportError(error);
        return Promise.reject(new ServiceError(
            ServiceErrorType.INTERNAL,
          ),
        );
      }
    }
}

