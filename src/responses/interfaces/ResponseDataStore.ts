import { Response } from '../../types/Response';
import { UserInfo } from '../../types/UserInfo';

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
        user: UserInfo,
    }): Promise<void>;
    getResponse(params: {
        ratingId: string,
    }): Promise<Response>;
    getResponseById(params: {
        responseId: string,
    }): Promise<Response>;
}
