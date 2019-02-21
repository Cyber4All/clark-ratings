import { ResponseDataStore } from '../interfaces/ResponseDataStore';
import { Response } from '../../types/Response';
import { MOCK_OBJECTS } from './MockObjects';

export class MockResponseStore implements ResponseDataStore {
    getResponses(params: { ratingId: string; }): Promise<Response[]> {
        return Promise.resolve([MOCK_OBJECTS.RESPONSE]);
    }
    getResponseById(params: { responseId: string; }): Promise<Response> {
        return Promise.resolve(MOCK_OBJECTS.RESPONSE);
    }
    deleteResponse(params: { responseId: string; }): Promise<void> {
        return Promise.resolve();
    }
    updateResponse(params: { responseId: string; updates: Response; }): Promise<void> {
        return Promise.resolve();
    }
    createResponse(params: { ratingId: string; response: Response; }): Promise<void> {
        return Promise.resolve();
    }
}
