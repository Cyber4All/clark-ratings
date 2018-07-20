import { LearningObject } from '@cyber4all/clark-entity';

export interface Rating {
    _id?: string;
    user?: string; // either the user or the user's ID

    number: number;
    comment: string;
    date: string;
}

export interface LearningObjectContainer {
    _id?: string,
    learningObjectId: string,
    avgRating: number,
    ratings: Rating[]
}