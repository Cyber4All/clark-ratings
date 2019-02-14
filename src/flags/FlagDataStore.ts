import { reportError } from "../drivers/SentryConnector";


export class MongoDriver implements FlagDataStore {

    constructor() {
        
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