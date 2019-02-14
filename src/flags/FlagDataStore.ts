import { reportError } from '../drivers/SentryConnector';
import { Db } from 'mongodb';
import { MongoDriver } from '../drivers/MongoDriver';
import { FlagDataStore } from './interfaces/FlagDataStore';
import { Flag } from '../types/Rating';

enum Collections {
    FLAGS = 'flags',
    RATINGS = 'ratings',
}

export class FlagStore implements FlagDataStore {

    private db: Db;

    constructor() {
        this.db = MongoDriver.getConnection();
    }

    async flagRating(
        ratingId: string,
        flag: Flag,
    ): Promise<void> {
        try {
            flag.ratingId = ratingId;
            flag.date = Date.now();
            await this.db.collection(Collections.FLAGS)
                .insert(flag);
            return Promise.resolve();
        } catch (error) {
            reportError(error);
            return Promise.reject(error);
        }
    }

    async getAllFlags(): Promise<Flag[]> {
        try {
            const flags = await this.db
                .collection(Collections.FLAGS)
                .find({})
                .toArray();
            return flags;
        } catch (error) {
            reportError(error);
            return Promise.reject(error);
        }
    }


    async getUserFlags(
        username: string,
    ): Promise<Flag[]> {
        try {
            const flags = await this.db
                .collection(Collections.FLAGS)
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
            .collection(Collections.RATINGS)
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
                .collection(Collections.FLAGS)
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
                .collection(Collections.FLAGS)
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
            await this.db.collection(Collections.FLAGS)
                .deleteOne({ _id: flagId });
            return Promise.resolve();
        } catch (error) {
            reportError(error);
            return Promise.reject(error);
        }
    }
}
