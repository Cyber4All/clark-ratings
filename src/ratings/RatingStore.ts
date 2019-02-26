import { Rating } from '../types/Rating';
import { reportError } from '../drivers/SentryConnector';
import { RatingDataStore } from './interfaces/RatingDataStore';
import { Db, ObjectId } from 'mongodb';
import { MongoDriver } from '../drivers/MongoDriver';
import { ServiceError, ServiceErrorReason } from '../errors';
import { UserInfo } from '../types/UserInfo';


enum Collections {
  RATINGS = 'ratings',
}

export class RatingStore implements RatingDataStore {
  private static instance: RatingDataStore;
  private db: Db;

  private constructor() {
      this.db = MongoDriver.getConnection();
  }

  /**
   * Get instance of RatingDataStore
   *
   * @returns { RatingDataStore }
   */
  static getInstance(): RatingDataStore {
      if (!this.instance) {
          this.instance = new RatingStore();
      }
      return this.instance;
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
            { _id: new ObjectId(params.ratingId) },
            { $set: {
              value: params.updates.value,
              comment: params.updates.comment,
              date: Date.now(),
            },
          });
        return Promise.resolve();
      } catch (error) {
        reportError(error);
        return Promise.reject(new ServiceError(
            ServiceErrorReason.INTERNAL,
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
          .findOneAndDelete({ _id: new ObjectId(params.ratingId) });
      } catch (error) {
        reportError(error);
        return Promise.reject(new ServiceError(
            ServiceErrorReason.INTERNAL,
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
        const rating = await this.db.collection(Collections.RATINGS)
          .findOne({ _id: new ObjectId(params.ratingId) });
        return {...rating, _id: rating._id.toString(), source: rating.source.toString()};
      } catch (error) {
        reportError(error);
        return Promise.reject(new ServiceError(
            ServiceErrorReason.INTERNAL,
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
    }): Promise<any> {
      try {
        const data = await this.db.collection(Collections.RATINGS)
          .aggregate(
          [
            {
              $match: { source: new ObjectId(params.learningObjectId) },
            },
            {
              $sort: { date: 1 },
            },
            {
              $lookup: {
                from: 'responses',
                localField: '_id',
                foreignField: 'source',
                as: 'response',
              },
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
                    response: '$response',
                  },
                },
              },
            },
          ],
        ).toArray();
        const result = this.convertMongoId(data[0]);
        return result;
      } catch (error) {
        reportError(error);
        return Promise.reject(new ServiceError(
            ServiceErrorReason.INTERNAL,
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
      user: UserInfo;
    }): Promise<void> {
      try {
        await this.db.collection(Collections.RATINGS)
          .insert({
            ...params.rating,
            user: params.user,
            source: new ObjectId(params.learningObjectId),
            date: Date.now(),
          });
      } catch (error) {
        return Promise.reject(
          new ServiceError(
            ServiceErrorReason.INTERNAL,
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
     * @returns { Promise<Rating[]> }
     */
    async getUsersRatings(params: {
      username: string;
    }): Promise<any> {
      try {
        const data = await this.db.collection(Collections.RATINGS)
          .aggregate(
          [
            {
              $match: { 'user.username': params.username },
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
            ServiceErrorReason.INTERNAL,
          ),
        );
      }
    }

    /**
     * Converts MongoDB ObjectId to string
     */
    convertMongoId(ratings: any) {
      const root = { ...ratings, _id: ratings._id.toString()};
      root.ratings = root.ratings.map(rating => this.convertRatingObjectId(rating));
      return root;
    }

    /**
     * Iterates through the array of ratings and converts MongoDB ObjectIds to strings
     */
    convertRatingObjectId(rating: any) {
      if (rating.response.length > 0) {
        rating.response = rating.response.map(response => this.convertResponseObjectId(response));
      }
      return {...rating, _id: rating._id.toString() };
    }

    /**
     * Iterates through the array of responses and converts MongoDB ObjectIds to strings
     */
    convertResponseObjectId(response: any) {
      return {...response, _id: response._id.toString(), source: response.source.toString() };
    }
}

