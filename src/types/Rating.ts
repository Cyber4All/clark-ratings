import { LearningObject } from '@cyber4all/clark-entity';

export interface Rating {
    _id?:  string;
    user?: { name: string, username: string, email: string }; // either the user or the user's ID
    date?: string;

    number:  number;
    comment: string;
   
}

export interface LearningObjectContainer {
    _id?: string,

    learningObjectId: string,
    avgRating:        number,
    ratings:          Rating[]
}

export interface Flag {
    _id?:      string,
    comment?:  string;
    ratingId?: string,
    date?:     string

    username: string;
    concern:  string,
    
}