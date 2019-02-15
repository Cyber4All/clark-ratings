import { MOCK_OBJECTS } from './mocks/MockObjects';
import * as interactor from './RatingsInteractor';
import { MockRatingStore } from './mocks/MockRatingStore';

const driver = new MockRatingStore();

let ratingId: string;

describe('createNewRating', () => {
  it('Should create a new rating object', () => {
    expect.assertions(1);
    return expect(interactor.createRating({
      dataStore: driver,
      rating: MOCK_OBJECTS.RATING,
      learningObjectId: MOCK_OBJECTS.LEARNING_OBJECT_ID,
      username: MOCK_OBJECTS.USER.username,
      email: MOCK_OBJECTS.USER.email,
      name: MOCK_OBJECTS.USER.name,
    }))
    .resolves
    .toBeUndefined();
  });
});

describe('getLearningObjectRatings', () => {
  it('Should get rating created in first test', () => {
    return expect(interactor.getLearningObjectRatings({
      dataStore: driver,
      learningObjectId: MOCK_OBJECTS.LEARNING_OBJECT_ID,
    }))
    .resolves
    .toEqual([MOCK_OBJECTS.RATING]);
  });
});

describe('updateRating', () => {
  it('Should throw error - only author of rating can do this', () => {
    expect.assertions(1);
    return expect(interactor.updateRating({
      dataStore: driver,
      ratingId,
      updates: MOCK_OBJECTS.RATING,
      currentUsername: MOCK_OBJECTS.USER.username,
    }))
    .resolves
    .toBeUndefined();
  });
  it('Should update the rating object created in first test', () => {
    expect.assertions(1);
    return expect(interactor.updateRating({
      dataStore: driver,
      ratingId,
      updates: MOCK_OBJECTS.RATING,
      currentUsername: MOCK_OBJECTS.USER.username,
    }))
    .resolves
    .toBeUndefined();
  });
});

describe('deleteRating', () => {
  it('Should throw error - only the author of rating can do this', () => {
    expect.assertions(1);
    return expect(interactor.deleteRating({
      dataStore: driver,
      ratingId,
      currentUsername: MOCK_OBJECTS.USER.username,
    }))
    .resolves
    .toBeUndefined();
  });
  it('Should delete the rating', () => {
    expect.assertions(1);
    return expect(interactor.deleteRating({
      dataStore: driver,
      ratingId,
      currentUsername: MOCK_OBJECTS.USER.username,
    }))
    .resolves
    .toBeUndefined();
  });
});




