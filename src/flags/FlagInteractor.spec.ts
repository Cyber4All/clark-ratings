import { MOCK_OBJECTS } from './mocks/MockObjects';
import * as interactor from './FlagInteractor';
import { MockFlagStore } from './mocks/MockFlagStore';

const driver = new MockFlagStore();

describe('flagRating', () => {
  it('Should return error - author of rating cannot perform this action!', () => {
      expect.assertions(1);
      return expect (interactor.flagRating({
        dataStore: driver,
        ratingId: MOCK_OBJECTS.FLAG._id,
        currentUsername: MOCK_OBJECTS.USERNAME,
        flag: MOCK_OBJECTS.FLAG,
      }))
      .resolves
      .toThrowError();
  });
  it('Should flag the rating', () => {
    expect.assertions(1);
    return expect (interactor.flagRating({
      dataStore: driver,
      ratingId: MOCK_OBJECTS.FLAG._id,
      currentUsername: MOCK_OBJECTS.USERNAME,
      flag: MOCK_OBJECTS.FLAG,
    }))
    .resolves
    .not
    .toThrowError();
  });
});

describe('getAllFlags', () => {
  it('Should return all flags - this is an admin operation', () => {
    expect.assertions(1);
    return expect (interactor.getAllFlags({
        dataStore: driver,
    }))
    .resolves
    .toEqual([MOCK_OBJECTS.FLAG]);
  });
});

describe('getRatingFlags', () => {
  it('Should return all flags for a specified rating - this is an admin operation', () => {
    expect.assertions(1);
    return expect (interactor.getRatingFlags({
      dataStore: driver,
      ratingId: MOCK_OBJECTS.FLAG._id,
    }))
    .resolves
    .toEqual([MOCK_OBJECTS.FLAG]);
  });
});

