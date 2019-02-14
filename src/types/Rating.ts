export type Rating = {
    _id?:  string;
    user?: { name: string, username: string, email: string }; // either the user or the user's ID
    date?: number;
    value:  number;
    comment: string;
    source: string;
};

export type LearningObjectContainer = {
    _id?: string;
    avgRating: number;
    ratings: Rating[];
};
