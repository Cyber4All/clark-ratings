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

    /**
     * Return instance of FlagDataStore
     * @returns { FlagDataStore }
     */
    static getInstance(): FlagDataStore {
        if (!this.instance) {
            this.instance = new FlagStore();
        }
        return this.instance;
    }

    /**
     * Flag a rating
     * @export
     * @param params
     * @property { Flag } flag new flag object
     * @property { string } ratingID the ID of the rating
     * @returns { Promise<void> }
     */
    async flagRating(params: {
        ratingID: string,
        flag: Flag,
    }): Promise<void> {
        params.flag.date = Date.now();
        await this.db.collection(Collections.FLAGS)
            .insert({
                ...params.flag,
                ratingID: new ObjectId(params.ratingID),
            });
    }

    /**
     * Fetch all flags
     * @returns { Promise<any> }
     */
    async getAllFlags(): Promise<Flag[]> {
        const flags = await this.db
            .collection(Collections.FLAGS)
            .find({})
            .toArray();
        return flags.map(flag => this.convertMongoId(flag));
    }

    /**
     * Get all flags for a rating
     * @param params
     * @property { string } ratingID the id of the rating
     * @returns { Promise<Flag[]> }
     */
    async getRatingFlags(params: {
        ratingID: string;
    }): Promise<Flag[]> {
        const flags = await this.db
            .collection(Collections.FLAGS)
            .find({ ratingID: new ObjectId(params.ratingID) })
            .toArray();
        return flags;
    }

    /**
     * Delete a flag
     * @param params
     * @property { string } flagID the id of the flag
     * @returns { Promise<void> }
     */
    async deleteFlag(params: {
        flagID: string;
    }): Promise<void> {
        await this.db.collection(Collections.FLAGS)
            .deleteOne({ _id: new ObjectId(params.flagID) });
    }

    /**
     * Converts a Mongo ObjectId to string
     * @export
     * @param { object } flag object with ObjectId _id
     * @returns { object } flag object with string _id
     */
    convertMongoId(flag: Flag) {
        return {...flag, _id: flag['_id'].toString(), ratingID: flag['ratingID'].toString()};
    }
}
