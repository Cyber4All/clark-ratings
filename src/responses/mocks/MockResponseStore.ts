import { ResponseDataStore } from '../interfaces/ResponseDataStore';
import { Response } from '../../types/Response';
import { MOCK_OBJECTS } from './MockObjects';

export class MockResponseStore implements ResponseDataStore {
    getResponses(params: { ratingIDs: string[]; }): Promise<Response[]> {
        return Promise.resolve([MOCK_OBJECTS.RESPONSE]);
    }
    getResponseById(params: { responseID: string; }): Promise<Response> {
        return Promise.resolve(MOCK_OBJECTS.RESPONSE);
    }
    deleteResponse(params: { responseID: string; }): Promise<void> {
        return Promise.resolve();
    }
    updateResponse(params: { responseID: string; updates: Response; }): Promise<void> {
        return Promise.resolve();
    }
    createResponse(params: { ratingID: string; response: Response; }): Promise<void> {
        return Promise.resolve();
    }
}
