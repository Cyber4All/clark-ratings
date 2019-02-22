export const MOCK_OBJECTS = {
    FLAG: {
        _id: '5ac520bdf5b97e186468964c',
        comment: 'This is a mock flag',
        ratingId: '5ac520bdf5b97e186468964b',
        date: 123,
        username: 'username',
        concern: 'Other',
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
