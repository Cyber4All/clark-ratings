import { MOCK_OBJECTS } from './mocks/MockObjects';
import { RatingDataStore } from './interfaces/RatingDataStore';
import { MongoDriver } from '../drivers/MongoDriver';
import { RatingStore } from './RatingStore';

describe('RatingStore', () => {
    let driver: RatingDataStore;

    beforeAll(async () => {
      await MongoDriver.build(global['__MONGO_URI__']);
      driver = RatingStore.getInstance();
    });

    describe('getRating', () => {
        it('Should fetch a document in the ratings collection', () => {
          expect.assertions(1);
          return expect(driver.getRating({
            ratingID: MOCK_OBJECTS.RATING._id,
          }))
          .resolves
          .toEqual(MOCK_OBJECTS.RATING);
        });
    });

    describe('getLearningObjectRatings', () => {
        it('Should fetch all ratings that belong to a learning object', () => {
          expect.assertions(1);
          return expect(driver.getLearningObjectsRatings({
            CUID: MOCK_OBJECTS.CUID,
          }))
          .resolves
          .toEqual(MOCK_OBJECTS.LEARNING_OBJECT_GROUPING);
        });
    });

    describe('createNewRating', () => {
      it('Should fetch all ratings that belong to a learning object', () => {
        expect.assertions(1);
        return expect(driver.createNewRating({
          rating: MOCK_OBJECTS.RATING,
          CUID: 'test_CUID',
          versionID: '0',
          user: MOCK_OBJECTS.USER_TOKEN,
        }))
        .resolves
        .not
        .toThrowError();
      });
  });

    describe('updateRating', () => {
      it('Should update a document in the ratings collection', () => {
        expect.assertions(1);
        return expect(driver.updateRating({
          ratingID: MOCK_OBJECTS.RATING._id,
          updates: MOCK_OBJECTS.RATING,
        }))
        .resolves
        .not
        .toThrowError();
      });
    });

    describe('deleteRating', () => {
      it('Should delete a document in the ratings collection', () => {
        expect.assertions(1);
        return expect(driver.deleteRating({
          ratingID: MOCK_OBJECTS.RATING._id,
        }))
        .resolves
        .not
        .toThrowError();
      });
  });
});
