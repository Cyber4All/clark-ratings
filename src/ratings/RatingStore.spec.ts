import { MOCK_OBJECTS } from './mocks/MockObjects';
import * as interactor from './RatingsInteractor';
import { MockRatingStore } from './mocks/MockRatingStore';
import { RatingDataStore } from './interfaces/RatingDataStore';
import { MongoDriver } from '../drivers/MongoDriver';
import { RatingStore } from './RatingStore';

describe('RatingStore', () => {
    let driver: RatingDataStore;

    beforeAll(async () => {
      await MongoDriver.build(global['__MONGO_URI__']);
      driver = RatingStore.getInstance();
    });

    describe('updateRating', () => {
        it('Should update a document in the ratings collection', () => {
          expect.assertions(1);
          return expect(driver.updateRating({
            ratingId: MOCK_OBJECTS.RATING._id,
            updates: MOCK_OBJECTS.RATING,
          }))
          .resolves
          .toBeUndefined();
        });
    });

    describe('deleteRating', () => {
        it('Should delete a document in the ratings collection', () => {
          expect.assertions(1);
          return expect(driver.deleteRating({
            ratingId: MOCK_OBJECTS.RATING._id,
          }))
          .resolves
          .toBeUndefined();
        });
    });

    describe('getRating', () => {
        it('Should fetch a document in the ratings collection', () => {
          expect.assertions(1);
          return expect(driver.getRating({
            ratingId: MOCK_OBJECTS.RATING._id,
          }))
          .resolves
          .toEqual(MOCK_OBJECTS.RATING);
        });
    });

    describe('getLearningObjectRatings', () => {
        it('Should fetch all ratings that belong to a learning object', () => {
          expect.assertions(1);
          return expect(driver.getLearningObjectsRatings({
            learningObjectId: MOCK_OBJECTS.LEARNING_OBJECT_ID,
          }))
          .resolves
          .toEqual([MOCK_OBJECTS.RATING]);
        });
    });

    describe('createNewRating', () => {
        it('Should fetch all ratings that belong to a learning object', () => {
          expect.assertions(1);
          return expect(driver.createNewRating({
            rating: MOCK_OBJECTS.RATING,
            learningObjectId: MOCK_OBJECTS.LEARNING_OBJECT_ID,
            username: MOCK_OBJECTS.USER.username,
            email: MOCK_OBJECTS.USER.email,
            name: MOCK_OBJECTS.USER.name,
          }))
          .resolves
          .toEqual([MOCK_OBJECTS.RATING]);
        });
    });

    describe('getUsersRatings', () => {
        it('Should fetch all ratings that belong to a user', () => {
          expect.assertions(1);
          return expect(driver.getUsersRatings({
            username: MOCK_OBJECTS.USER.username,
          }))
          .resolves
          .toEqual([MOCK_OBJECTS.RATING]);
        });
    });
});
