import { ResponseDataStore } from './interfaces/ResponseDataStore';
import { MongoDriver } from '../drivers/MongoDriver';
import { Db } from 'mongodb';
import { reportError } from '../drivers/SentryConnector';
import { ServiceError, ServiceErrorType } from '../errors';
import { Response } from '../types/Response';

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
            await this.db.collection(Collections.RESPONSES)
                .deleteOne({
                    _id: params.responseId,
                });
        } catch (error) {
            reportError(error);
            return Promise.reject(
                new ServiceError(
                    ServiceErrorType.INTERNAL,
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
            await this.db.collection(Collections.RESPONSES)
                .findOneAndUpdate(
                    {_id: params.responseId },
                    { $set: { updates } },
                );
        } catch (error) {
            reportError(error);
            return Promise.reject(
                new ServiceError(
                    ServiceErrorType.INTERNAL,
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
        ratingId: string,
        response: Response,
    }): Promise<void> {
        try {
            await this.db.collection(Collections.RESPONSES)
                .insert({
                    ...params.response,
                    source: params.ratingId,
                    date: Date.now(),
                });
        } catch (error) {
            reportError(error);
            return Promise.reject(
                new ServiceError(
                    ServiceErrorType.INTERNAL,
                ),
            );
        }
    }
}
