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
   * @property { string } ratingID the id of the parent rating document
   * @property { Rating } updates Rating object that contains updates
   * @returns { Promise<void> }
   */
  async updateRating(params: {
    ratingID: string;
    updates: Rating;
  }): Promise<void> {
    await this.db.collection(Collections.RATINGS)
      .findOneAndUpdate(
        { _id: new ObjectId(params.ratingID) },
        { $set: {
          value: params.updates.value,
          comment: params.updates.comment,
          date: Date.now(),
        },
      });
    }

    /**
     * Delete a specified response document
     * @export
     * @param params
     * @property { string } ratingID the ID of the parent rating document
     * @returns { Promise<void> }
     */
    async deleteRating(params: {
      ratingID: string;
    }): Promise<void> {
      await this.db.collection(Collections.RATINGS)
        .findOneAndDelete({ _id: new ObjectId(params.ratingID) });
    }

    /**
     * Fetch a specified response document
     * @export
     * @param params
     * @property { string } ratingID the id of the parent rating document
     * @returns { Promise<Rating> }
     */
    async getRating(params: {
      ratingID: string;
    }): Promise<Rating> {
        const rating = await this.db.collection(Collections.RATINGS)
          .findOne({ _id: new ObjectId(params.ratingID) });
        return { ...rating, _id: rating._id.toString() };
    }

    /**
     * Fetch all ratings that belong to a learning object
     * @export
     * @param params
     * @property { string } learningObjectId the id of the learning object
     * @returns { Promise<Rating[]> }
     */
    async getLearningObjectsRatings(params: {
      CUID: string;
    }): Promise<any> {
      const data = await this.db.collection(Collections.RATINGS)
        .aggregate(
        [
          {
            $match: { 'source.CUID': params.CUID },
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
              _id: '$source.CUID',
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
      if (data.length > 0) {
        const result = this.convertMongoId(data[0]);
        return result;
      }
      return data[0];
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
      CUID: string;
      versionID: string;
      user: UserInfo;
    }): Promise<void> {
      await this.db.collection(Collections.RATINGS)
        .insert({
          ...params.rating,
          user: params.user,
          source: {
            CUID: params.CUID,
            version: params.versionID,
          },
          date: Date.now(),
        });
    }

    /**
     * Converts MongoDB ObjectId to string
     */
    convertMongoId(ratings: any) {
      const root = { ...ratings, _id: ratings._id.toString() };
      root.ratings = root.ratings.map((rating: any) => this.convertRatingObjectId(rating));
      return root;
    }

    /**
     * Iterates through the array of ratings and converts MongoDB ObjectIds to strings
     */
    convertRatingObjectId(rating: any) {
      if (rating.response.length > 0) {
        rating.response = rating.response.map((response: any) => this.convertResponseObjectId(response));
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
