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
     * Single pattern - returns up to one instance of
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
     * @property {string } responseId the id of the reponse document
     * @returns Promise<void>
     */
    async deleteResponse(params: {
        responseId: string,
    }): Promise<void> {
        try {
            await this.db
                .collection(Collections.RESPONSES)
                .deleteOne({
                    _id: new ObjectId(params.responseId),
                });
        } catch (error) {
            reportError(error);
            return Promise.reject(
                new ServiceError(
                    ServiceErrorReason.INTERNAL,
                ),
            );
        }
    }

    /**
     * Fetch a response document by its source
     * @export
     * @param params
     * @property {string } ratingId the id of the rating document (source of the response)
     * @returns Promise<Response>
     */
    async getResponses(params: {
        ratingIds: string[],
    }): Promise<Response[]> {
        try {
            const objectIds  = params.ratingIds.map(id => new ObjectId(id));
            const response = await this.db
                .collection(Collections.RESPONSES)
                .find({
                    source: { $in: objectIds },
                }).toArray();
            return response;
        } catch (error) {
            reportError(error);
            return Promise.reject(
                new ServiceError(
                    ServiceErrorReason.INTERNAL,
                ),
            );
        }
    }

    /**
     * fetch a response document by its source
     * @export
     * @param params
     * @property {string } responseId the id of the response
     * @returns Promise<Response>
     */
    async getResponseById(params: {
        responseId: string,
    }): Promise<Response> {
        try {
            const response = await this.db
                .collection(Collections.RESPONSES)
                .findOne({
                    _id: new ObjectId(params.responseId),
                });
            return response;
        } catch (error) {
            reportError(error);
            return Promise.reject(
                new ServiceError(
                    ServiceErrorReason.INTERNAL,
                ),
            );
        }
    }


    /**
     * Update a specified response document
     * @export
     * @param params
     * @property { string } responseId the id of the reponse document
     * @property { Response } updates Response object containing updated values
     * @returns Promise<void>
     */
    async updateResponse(params: {
        responseId: string,
        updates: Response,
    }): Promise<void> {
        try {
            const updates = params.updates;
            await this.db
                .collection(Collections.RESPONSES)
                .findOneAndUpdate(
                    {_id: new ObjectId(params.responseId) },
                    { $set: {
                        ...updates,
                        date: Date.now(),
                    } },
                );
        } catch (error) {
            reportError(error);
            return Promise.reject(
                new ServiceError(
                    ServiceErrorReason.INTERNAL,
                ),
            );
        }
    }

    /**
     * Update a specified response document
     * @export
     * @param params
     * @property { string } ratingId the id of the parent rating document
     * @property { Response } response Reponse object to insert
     * @returns Promise<void>
     */
    async createResponse(params: {
        ratingId: string;
        response: Response;
        user: UserInfo;
    }): Promise<void> {
        try {
            await this.db
                .collection(Collections.RESPONSES)
                .insert({
                    ...params.response,
                    source: new ObjectId(params.ratingId),
                    user: params.user,
                    date: Date.now(),
                });
        } catch (error) {
            reportError(error);
            return Promise.reject(
                new ServiceError(
                    ServiceErrorReason.INTERNAL,
                ),
            );
        }
    }
}
