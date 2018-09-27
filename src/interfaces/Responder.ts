import { Rating, LearningObjectContainer } from '../types/Rating';

export interface Responder {
    sendOperationSuccess(): void;
    sendOperationError(error?: string, status?: number): void;
    sendRatings(rating: Rating | LearningObjectContainer): void;
}