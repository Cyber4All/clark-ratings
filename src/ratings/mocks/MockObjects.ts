
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
        source: 'learning-object-id',
    },
    USER: {
        username: 'username',
        email: 'test@test.com',
        name: 'unit test',
    },
    LEARNING_OBJECT_ID: 'learning-object-id',
    RATING_ID: '5ac520bdf5b97e186468964b',
    LEARNING_OBJECT_GROUPING: {
        '_id': 'learning-object-id',
        'avgValue': 2,
        'ratings': [
            {'_id': '5ac520bdf5b97e186468964b',
            'comment': 'This is a mock rating',
            'date': 123,
            'user': {
                'email': 'email@email',
                'name': 'name',
                'username': 'username',
            },
            'value': 2},
        ],
    },
    USER_GROUPING : {
        '_id': 'learning-object-id',
        'avgValue': 2,
        'ratings': [
            {
                '_id': '5ac520bdf5b97e186468964b',
                'comment': 'This is a mock rating',
                'date': 123,
                'user': {'email': 'email@email', 'name': 'name', 'username': 'username'}, 'value': 2}]},
};

