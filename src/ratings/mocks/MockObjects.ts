
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
        source: '5ac520bdf5b97e1864689123',
    },
    USER: {
        username: 'username',
        email: 'test@test.com',
        name: 'unit test',
    },
    LEARNING_OBJECT_ID: '5ac520bdf5b97e1864689123',
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
                'user': {'email': 'email@email', 'name': 'name', 'username': 'username'}, 'value': 2}]
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

