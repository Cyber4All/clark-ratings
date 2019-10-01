export type Rating = {
    _id?:  string;
    user?: { name: string, username: string, email: string }; 
    date?: number;
    value:  number;
    comment: string;
    source?: {
        cuid: string;
        version: string;
    };
};

