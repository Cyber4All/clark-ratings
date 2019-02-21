import { MOCK_OBJECTS } from './mocks/MockObjects';
import * as interactor from './RatingsInteractor';
import { MockRatingStore } from './mocks/MockRatingStore';

const driver = new MockRatingStore();

describe('createNewRating', () => {
  it('Should create a new rating object', () => {
    expect.assertions(1);
    return expect(interactor.createRating({
      rating: MOCK_OBJECTS.RATING,
      learningObjectId: MOCK_OBJECTS.LEARNING_OBJECT_ID,
      user: MOCK_OBJECTS.USER_TOKEN,
    }))
    .resolves
    .toBeUndefined();
  });
});

describe('getLearningObjectRatings', () => {
  it('Should get rating created in first test', () => {
    return expect(interactor.getLearningObjectRatings({
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
      ratingId: MOCK_OBJECTS.RATING._id,
      updates: MOCK_OBJECTS.RATING,
      user: MOCK_OBJECTS.USER_TOKEN,
    }))
    .resolves
    .toBeUndefined();
  });
  it('Should update the rating object created in first test', () => {
    expect.assertions(1);
    return expect(interactor.updateRating({
      ratingId: MOCK_OBJECTS.RATING._id,
      updates: MOCK_OBJECTS.RATING,
      user: MOCK_OBJECTS.USER_TOKEN,
    }))
    .resolves
    .toBeUndefined();
  });
});

describe('deleteRating', () => {
  it('Should throw error - only the author of rating can do this', () => {
    expect.assertions(1);
    return expect(interactor.deleteRating({
      ratingId: MOCK_OBJECTS.RATING._id,
      user: MOCK_OBJECTS.USER_TOKEN,
    }))
    .resolves
    .toBeUndefined();
  });
  it('Should delete the rating', () => {
    expect.assertions(1);
    return expect(interactor.deleteRating({
      ratingId: MOCK_OBJECTS.RATING._id,
      user: MOCK_OBJECTS.USER_TOKEN,
    }))
    .resolves
    .toBeUndefined();
  });
});




