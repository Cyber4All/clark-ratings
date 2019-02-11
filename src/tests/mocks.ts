import * as dotenv from 'dotenv';
dotenv.config();

export const MOCK_OBJECTS = {
  USERNAME_QUERY: { username: 'nvisal1' },
  EMPTY_USERNAME_QUERY: { username: '' },
  USERNAME: 'cypress',
  USERNAME_OTHER: 'nvisal1',
  PASSWORD: 'Clarktesting1!',
  EMAIL: 'test@test.com',
  EMPTY_STRING: '',
  LEARNING_OBJECT_NAME: 'test',
  LEARNING_OBJECT_AUTHOR: 'nvisal1',
  LEARNING_OBJECT_ID: 'default_id',
  NAME: 'nick testing',
  RATING: {
    value:  4,
    comment: 'unit test',
    user: {
      name: 'nick testing',
      username: 'cypress',
      email: 'test@test.com',
    },
    source: '123',
  },
  AUTH_CHECK_RATING: {
    number:  4,
    comment: 'unit test',
    user: {
      name: 'nick testing',
      username: 'notusername',
      email: 'test@test.com',
    },
  },
  EDIT_RATING: {
    value:  3,
    comment: 'unit test edit',
    source: 'default_id',
  },
  CYPRESS_FLAG: {
    comment: 'unit test flag',
    username: 'cypress',
    concern: 'unit test concern label',
  },
  FLAG: {
    comment: 'unit test flag',
    username: 'nvisal1',
    concern: 'unit test concern label',
  },
  CONTAINER: {
    learningObjectId: '5a73843552d76b71726242a7',
    avgRating: 3.2,
    ratings: [],
  },
};