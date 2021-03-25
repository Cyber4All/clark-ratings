import { ResponseDataStore } from './interfaces/ResponseDataStore';
import { MongoDriver } from '../drivers/MongoDriver';
import { Db, ObjectId } from 'mongodb';
import { reportError } from '../drivers/SentryConnector';
import { ServiceError, ServiceErrorReason } from '../errors';
import { Response } from '../types/Response';
import { UserInfo } from '../types/UserInfo';

enum Collections {
    RESPONSES = 'responses',
}

export class ResponseStore implements ResponseDataStore {

    private static instance: ResponseDataStore;
    private db: Db;

    private constructor() {
        this.db = MongoDriver.getConnection();
    }

    /**
     * returns up to one instance of
     * the ResponseStore class
     */
    static getInstance(): ResponseDataStore {
        if (!ResponseStore.instance) {
            ResponseStore.instance = new ResponseStore();
        }
        return ResponseStore.instance;
    }

    /**
     * Delete a specified response document
     * @export
     * @param params
     * @property {string } responseID the ID of the response document
     * @returns Promise<void>
     */
    async deleteResponse(params: {
        responseID: string,
    }): Promise<void> {
        await this.db
            .collection(Collections.RESPONSES)
            .deleteOne({
                _id: new ObjectId(params.responseID),
            });
    }

    /**
     * Fetch a response document by its source
     * @export
     * @param params
     * @property {string } ratingID the id of the rating document (source of the response)
     * @returns Promise<Response>
     */
    async getResponses(params: {
        ratingIDs: string[],
    }): Promise<Response[]> {
        const objectIds  = params.ratingIDs.map(id => new ObjectId(id));
        const response = await this.db
            .collection(Collections.RESPONSES)
            .find({
                source: { $in: objectIds },
            }).toArray();
        return response;
    }

    /**
     * fetch a response document by its source
     * @export
     * @param params
     * @property {string } responseID the ID of the response
     * @returns Promise<Response>
     */
    async getResponseById(params: {
        responseID: string,
    }): Promise<Response> {
        const response = await this.db
            .collection(Collections.RESPONSES)
            .findOne({
                _id: new ObjectId(params.responseID),
            });
        return response;
    }


    /**
     * Update a specified response document
     * @export
     * @param params
     * @property { string } responseID the ID of the reponse document
     * @property { Response } updates Response object containing updated values
     * @returns Promise<void>
     */
    async updateResponse(params: {
        responseID: string,
        updates: Response,
    }): Promise<void> {
        const updates = params.updates;
        await this.db
            .collection(Collections.RESPONSES)
            .findOneAndUpdate(
                {_id: new ObjectId(params.responseID) },
                { $set: {
                    ...updates,
                    date: Date.now(),
                } },
            );
    }

    /**
     * Update a specified response document
     * @export
     * @param params
     * @property { string } ratingID the id of the parent rating document
     * @property { Response } response Reponse object to insert
     * @returns Promise<void>
     */
    async createResponse(params: {
        ratingID: string;
        response: Response;
        user: UserInfo;
    }): Promise<void> {
        await this.db
            .collection(Collections.RESPONSES)
            .insertOne({
                ...params.response,
                source: new ObjectId(params.ratingID),
                user: params.user,
                date: Date.now(),
            });
    }
}
