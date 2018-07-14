import { User, LearningObject } from '@cyber4all/clark-entity';

export interface Rating {
    id?: string;
    learningObject?: LearningObject | string; // either the learning object or it's ID

    number: number;
    comment: string;
    user: User | string; // either the user or the user's ID
    date: string;
}