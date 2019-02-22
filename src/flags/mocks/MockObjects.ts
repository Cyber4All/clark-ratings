export const MOCK_OBJECTS = {
    FLAG_REPSONSE: {[
            {
                _id: '5ac520bdf5b97e186468964c',
                comment: 'This is a mock flag',
                concern: 'Other',
                date: 123,
                ratingId: '5ac520bdf5b97e186468964b',
                username: 'author',
            }
    ]},
    FLAG: {
        _id: '5ac520bdf5b97e186468964c',
        comment: 'This is a mock flag',
        concern: 'Other',
        date: 123,
        ratingId: '5ac520bdf5b97e186468964b',
        username: 'author',
    },
    USERNAME: 'test',
    LEARNING_OBJECT_ID: 'learning-object-id',
    USER_TOKEN: {
        username: 'username',
        name: 'name',
        email: 'email',
        organization: 'organization',
        emailVerified: false,
        accessGroups: ['editor'],
    },
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
};
