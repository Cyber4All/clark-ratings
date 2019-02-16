import { ResponseDataStore } from '../interfaces/ResponseDataStore';
import { Response } from '../../types/Response';

export class MockResponseStore implements ResponseDataStore {
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
