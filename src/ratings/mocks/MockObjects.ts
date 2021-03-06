import { ObjectId } from 'mongodb';

export const MOCK_OBJECTS = {
    RATING: {
        _id: '5ac520bdf5b97e186468964b',
        user: {
            name: 'name',
            username: 'username',
            email: 'email@email',
        },
        date: 123,
        value:  2,
        comment: 'This is a mock rating',
        source: {
            cuid: 'test_CUID',
            version: '0',
        },
    },
    USER: {
        username: 'username',
        email: 'test@test.com',
        name: 'unit test',
    },
    CUID: 'test_CUID',
    RATING_ID: '5ac520bdf5b97e186468964b',
    LEARNING_OBJECT_GROUPING: {
    _id: 'test_CUID',
    avgValue: 2,
    ratings: [
        {
            _id: '5ac520bdf5b97e186468964b',
            comment: 'This is a mock rating',
            date: 123,
            response: [
                {
                _id: '5c5c8fda47c664308b131469',
                comment: 'This is a mock response',
                date: 123,
                source: '5ac520bdf5b97e186468964b',
                user: {
                    email: 'email@email',
                    name: 'name',
                    username: 'username',
                },
            }],
            user: {
                email: 'email@email',
                name: 'name',
                username: 'username',
            },
            value: 2,
        }]},
    USER_GROUPING : {
        _id: '5ac520bdf5b97e1864689123',
        avgValue: 2,
        ratings: [
            {
                _id: '5ac520bdf5b97e186468964b',
                comment: 'This is a mock rating',
                date: 123,
                user: {
                    email: 'email@email',
                    name: 'name',
                    username: 'username',
                }, value: 2}],
    },
    USER_TOKEN: {
        username: 'username',
        name: 'name',
        email: 'email',
        organization: 'organization',
        emailVerified: false,
        accessGroups: ['editor'],
    },
};

