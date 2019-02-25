import { reportError } from '../drivers/SentryConnector';
import { Db, ObjectId } from 'mongodb';
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
            params.flag.date = Date.now();
            await this.db.collection(Collections.FLAGS)
                .insert({
                    ...params.flag,
                    ratingId: new ObjectId(params.ratingId),
                });
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

    async getRatingFlags(params: {
        ratingId: string;
    }): Promise<Flag[]> {
        try {
            // get learning object id
            const flags = await this.db
                .collection(Collections.FLAGS)
                .find({ ratingId: new ObjectId(params.ratingId) })
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
                .deleteOne({ _id: new ObjectId(params.flagId) });
            return Promise.resolve();
        } catch (error) {
            reportError(error);
            return Promise.reject(error);
        }
    }

    /**
     * Converts a Mongo ObjectId to string
     * @export
     * @param { object } flag object with ObjectId _id
     * @returns { object } flag object with string _id
     */
    convertMongoId(flag: object) {
        return {...flag, _id: flag['_id'].toString(), ratingId: flag['ratingId'].toString()};
    }
}
