const { MongoClient, ObjectId } = require('mongodb');

let connection;
let db;

const RATING_MOCK = { 
    _id: new ObjectId('5ac520bdf5b97e186468964b'),
    user: { 
        name: 'name',
        username: 'username',
        email: 'email@email',
    },
    date: 123,
    value:  2,
    comment: 'This is a mock rating',
    source: 'learning-object-id',
}

const FLAG_MOCK = { 
    _id: 'flag_id',
    comment: 'This is a mock flaf',
    ratingId: '5ac520bdf5b97e186468964b',
    date: 123,
    username: 'author',
    concern: 'Other',
}

const RESPONSE_MOCK = { 
    _id: 'response_id',
    user: {
        username: 'username',
        email: 'email@email',
        name: 'name',
    },
    date: 123,
    comment: 'This is a mock response',
    source: '5ac520bdf5b97e186468964b',
}

async function seedDatabase(uri){ 
    connection = await MongoClient.connect(uri);
    db = connection.db();
    
    await db.createCollection('ratings');
    await db.createCollection('flags');
    await db.createCollection('responses');

    await db.collection('ratings').insertOne(RATING_MOCK);
    await db.collection('flags').insertOne(FLAG_MOCK);
    await db.collection('responses').insertOne(RESPONSE_MOCK);
}

module.exports = seedDatabase;