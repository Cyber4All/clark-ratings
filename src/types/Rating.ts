import { LearningObject } from '@cyber4all/clark-entity';

export interface Rating {
    _id?: string;
    learningObject?: LearningObject | string; // either the learning object or it's ID
    user?: string; // either the user or the user's ID

    number: number;
    comment: string;
    date: string;
}