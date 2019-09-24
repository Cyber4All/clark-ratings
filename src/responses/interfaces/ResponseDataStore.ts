import { Response } from '../../types/Response';
import { UserInfo } from '../../types/UserInfo';

export interface ResponseDataStore {
    deleteResponse(params: {
        responseID: string,
    }): Promise<void>;
    updateResponse(params: {
        responseID: string,
        updates: Response,
    }): Promise<void>;
    createResponse(params: {
        ratingID: string,
        response: Response,
        user: UserInfo,
    }): Promise<void>;
    getResponses(params: {
        ratingIDs: string[],
    }): Promise<Response[]>;
    getResponseById(params: {
        responseID: string,
    }): Promise<Response>;
}
