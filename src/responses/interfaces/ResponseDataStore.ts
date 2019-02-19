import { Response } from '../../types/Response';

export interface ResponseDataStore {
    deleteResponse(params: {
        responseId: string,
    }): Promise<void>;
    updateResponse(params: {
        responseId: string,
        updates: Response,
    }): Promise<void>;
    createResponse(params: {
        ratingId: string,
        response: Response,
        username: string,
        name: string,
        email: string,
    }): Promise<void>;
    getResponse(params: {
        ratingId: string,
    }): Promise<Response>;
}
