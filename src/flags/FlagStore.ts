import { reportError } from '../drivers/SentryConnector';
import { Db } from 'mongodb';
import { MongoDriver } from '../drivers/MongoDriver';
import { FlagDataStore } from './interfaces/FlagDataStore';
import { Flag } from '../types/Flag';

enum Collections {
    FLAGS = 'flags',
    RATINGS = 'ratings',
}

export class FlagStore implements FlagDataStore {
    private static instance: FlagDataStore;
    private db: Db;

    private constructor() {
        this.db = MongoDriver.getConnection();
    }

    static getInstance(): FlagDataStore {
        if (!FlagStore.instance) {
            FlagStore.instance = new FlagStore();
        }
        return FlagStore.instance;
    }

    async flagRating(params: {
        ratingId: string,
        flag: Flag,
    }): Promise<void> {
        try {
            params.flag.ratingId = params.ratingId;
            params.flag.date = Date.now();
            await this.db.collection(Collections.FLAGS)
                .insert(params.flag);
            return Promise.resolve();
        } catch (error) {
            reportError(error);
            return Promise.reject(error);
        }
    }

    async getAllFlags(): Promise<any> {
        try {
            const flags = await this.db
                .collection(Collections.FLAGS)
                .find({})
                .toArray();
            return flags.map(flag => this.convertMongoId(flag));
        } catch (error) {
            reportError(error);
            return Promise.reject(error);
        }
    }


    async getUserFlags(params: {
        username: string;
    }): Promise<Flag[]> {
        try {
            const flags = await this.db
                .collection(Collections.FLAGS)
                .find({ username: params.username })
                .toArray();
            return flags;
        } catch (error) {
            reportError(error);
            return Promise.reject(error);
        }
    }

    async getLearningObjectFlags(params: {
        learningObjectId: string;
    }): Promise<Flag[]> {
        try {
            // get all rating ids that are attached to the specified learning object
            const ratingIds = await this.db
            .collection(Collections.RATINGS)
            .aggregate([
                { $match: params.learningObjectId },
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


    async getRatingFlags(params: {
        ratingId: string;
    }): Promise<Flag[]> {
        try {
            // get learning object id
            const flags = await this.db
                .collection(Collections.FLAGS)
                .find({ ratingId: params.ratingId })
                .toArray();
            return flags;
        } catch (error) {
            reportError(error);
            return Promise.reject(error);
        }
    }

    async deleteFlag(params: {
        flagId: string;
    }): Promise<void> {
        try {
            await this.db.collection(Collections.FLAGS)
                .deleteOne({ _id: params.flagId });
            return Promise.resolve();
        } catch (error) {
            reportError(error);
            return Promise.reject(error);
        }
    }

    convertMongoId(flag: object) {
        return {...flag, _id: flag['_id'].toString()};
    }
}
