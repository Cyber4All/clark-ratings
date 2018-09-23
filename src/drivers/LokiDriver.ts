import { DataStore } from '../interfaces/DataStore';
import * as loki from 'lokijs';
import { Rating } from '../types/Rating';

export class LokiDriver implements DataStore {
    private db: loki;

    constructor() {
        this.db = new loki('lokistore.json');
    }

    updateRating(
        ratingId: string, 
        learningObjectName: string, 
        learningObjectAuthor: string, 
        editRating: Rating
    ): Promise<void> {
        const coll = this.db.getCollection('ratings');
        const resultsSet = coll.chain().find({ _id: ratingId });
        resultsSet.update(editRating);
        return;
    }

    deleteRating(
        ratingId: string, 
        learningObjectName: string, 
        learningObjectAuthor: string
    ): Promise<void> {
       const coll = this.db.getCollection('ratings');
       const coll2 = this.db.getCollection('flags');
       const resultSet = coll.chain().find({ _id: ratingId });
       const resultSet2 = coll2.chain().find({ ratingId: ratingId });
       resultSet.remove();
       resultSet2.remove();
       return;
    }
    
    getRating(ratingId: string): Promise<Rating> {
        const coll = this.db.getCollection('ratings');
        const rating = coll.find({ _id: ratingId });
        return rating;
    }

    getUsersRatings(username: string): Promise<Rating[]> {
        const coll = this.db.getCollection('users');
        const coll2 = this.db.getCollection('ratings');
        const user  = coll.find({ username });
        const ratings = coll2.find({ user: user._id });
        return ratings;
    }
    
    getLearningObjectsRatings(
        learningObjectName: string, 
        learningObjectAuthor: string
    ): Promise<Rating[]> {
       const coll = this.db.getCollection('ratings');
       const ratings = coll.find({_id: })
       return ratings;
    }
    
    createNewRating(
        rating: Rating, 
        learningObjectName: string, 
        learningObjectAuthor: string, 
        username: string, 
        email: string, 
        name: string
    ): Promise<void> {
        const coll = this.db.getCollection('ratings');
        coll.insert(rating);
        return;
    }
    
    flagRating(
        ratingId: string, 
        flag: Flag
    ) {
       const coll = this.db.getCollection('flags');
       coll.insert(flag);
       return;
    }
    
    getAllFlags() {
       const coll = this.db.getCollection('flags');
       const flags = coll.find();
       return flags;
    }
    
    getUserFlags(username: string) {
       const coll = this.db.getCollection('flags');
       const flags = coll.find();
       return flags;
    }
    
    getLearningObjectFlags(
        learningObjectName: string, 
        learningObjectAuthor: string
    ) {
       const coll = this.db.getCollection('flags');
       const flags = coll.find();
       return flags;
    }
    
    getRatingFlags(
        learningObjectName: string, 
        learningObjectAuthor: string, 
        ratingId: string
    ) {
       const coll = this.db.getCollection('flags');
       const flags = coll.find();
       return flags;
    }
    
    deleteFlag(
        learningObjectName: any, 
        learningObjectAuthor: any, 
        ratingId: any,
        flagId: any
    ) {
      const coll = this.db.getCollection('flags');
      coll.remove();
      return;  
    }
}