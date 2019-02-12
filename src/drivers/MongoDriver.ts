import { DataStore } from '../interfaces/interfaces';
import { Rating, Flag, LearningObjectContainer } from '../types/Rating';
import { MongoClient, Db, ObjectId, ObjectID } from 'mongodb';
import { reportError } from './SentryConnector';

export class Collections {
  static ratings: string = 'ratings';
  static objects: string = 'objects';
  static users: string = 'users';
  static flags: string = 'flags';
}

export class MongoDriver implements DataStore {
  private db: Db;
  private mongoClient: MongoClient;

  /**
   * Connect to the database. Must be called before any other functions.
   * @async
   *
   * NOTE: This function will attempt to connect to the database every
   *       time it is called, but since it assigns the result to a local
   *       variable which can only ever be created once, only one
   *       connection will ever be active at a time.
   *
   * TODO: Verify that connections are automatically closed
   *       when they no longer have a reference.
   *
   * @param {string} dbIP the host and port on which mongodb is running
   */
  async connect(dbURI: string, retryAttempt?: number): Promise<void> {
    try {
      this.mongoClient = await MongoClient.connect(dbURI);
      this.db = this.mongoClient.db();
    } catch (error) {
      if (!retryAttempt) {
        this.connect(dbURI, 1);
      } else {
        reportError(error);
        return Promise.reject(
          'Problem connecting to database at ' + dbURI + ':\n\t' + error,
        );
      }
    }
  }

  static async build(dburi: string) {
    const driver = new MongoDriver();
    await driver.connect(dburi);
    return driver;
  }

  /**
   * Close the database. Note that this will affect all services
   * and scripts using the database, so only do this if it's very
   * important or if you are sure that *everything* is finished.
   */
  disconnect(): void {
    this.mongoClient.close();
  }

  async updateRating(ratingId: string, updatedRating: Rating): Promise<void> {
    try {
      await this.db.collection(Collections.ratings)
        .findOneAndUpdate(
          { _id: new ObjectID(ratingId) },
          { $set: { value: updatedRating.value, comment: updatedRating.comment, date: Date.now() },
        });
      return Promise.resolve();
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }

  async deleteRating(
    ratingId: string,
  ): Promise<void> {
    try {
      await this.db.collection(Collections.ratings).findOneAndDelete({ _id: new ObjectID(ratingId) });
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }

  async getRating(ratingId: string): Promise<Rating> {
    try {
      return (await this.db.collection(Collections.ratings).find({ _id: new ObjectId(ratingId) }).toArray())[0];
    } catch (error) {
      reportError(error);
      return Promise.reject('Problem retrieving rating! Error: ' + error);
    }
  }

  async getLearningObjectsRatings(
    learningObjectId: string,
  ): Promise<LearningObjectContainer> {
    try {
      const data = await this.db.collection(Collections.ratings).aggregate([
        {
          $match: { source: learningObjectId },
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
      ]).toArray();

      return data[0];
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }

  async createNewRating(
    rating: Rating,
    learningObjectId: string,
    username: string,
    email: string,
    name: string,
  ): Promise<void> {
    // TODO implement this
  }

  async flagRating(ratingId: string, flag: Flag): Promise<void> {
    try {
      flag.ratingId = ratingId;
      flag._id = new ObjectId().toHexString();
      flag.date = flag._id.toString().substring(0, 8);
      await this.db.collection(Collections.flags).insert(flag);
      return Promise.resolve();
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }

  async getAllFlags(): Promise<Flag[]> {
    try {
      const flags = await this.db
        .collection(Collections.flags)
        .find({})
        .toArray();
      return flags;
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }

  async getUserFlags(username: string): Promise<Flag[]> {
    try {
      const flags = await this.db
        .collection(Collections.flags)
        .find({ username: username })
        .toArray();
      return flags;
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }

  async getLearningObjectFlags(
    learningObjectId: string,
  ): Promise<Flag[]> {
    try {
      // get all rating ids that are attached to the specified learning object
      const ratingIds = await this.db
        .collection(Collections.ratings)
        .aggregate([
          { $match: learningObjectId },
          { $unwind: '$ratings' },
          {
            $project: {
              id: '$ratings._id',
            },
          },
        ])
        .toArray();
      const flags = await this.db
        .collection(Collections.flags)
        .find({ ratingId: ratingIds })
        .toArray();
      return flags;
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }

  async getRatingFlags(
    ratingId: string,
  ): Promise<Flag[]> {
    try {
      // get learning object id
      const flags = await this.db
        .collection(Collections.flags)
        .find({ ratingId: ratingId })
        .toArray();
      return flags;
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }

  async deleteFlag(
    flagId: string,
  ): Promise<void> {
    try {
      // get learning object id
      await this.db.collection(Collections.flags).deleteOne({ _id: flagId });
      return Promise.resolve();
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }
}
