import { FlagStore } from './FlagStore';
import { MongoDriver } from '../drivers/MongoDriver';
import { FlagDataStore } from './interfaces/FlagDataStore';
import { MOCK_OBJECTS } from './mocks/MockObjects';

describe('FlagStore', () => {
  let driver: FlagDataStore;

  beforeAll(async () => {
    await MongoDriver.build(global['__MONGO_URI__']);
    driver = FlagStore.getInstance();
  });

  describe('flagRating', () => {
    it('Should insert a document into the flags collection', () => {
      expect.assertions(1);
      return expect(driver.flagRating({
        ratingId: MOCK_OBJECTS.FLAG._id,
        flag: MOCK_OBJECTS.FLAG,
      }))
      .resolves
      .toBeUndefined();
    });
  });

  describe('getAllFlags', () => {
    it('Should return array of all documents in flags collection', () => {
      expect.assertions(1);
      return expect(
        driver.getAllFlags(),
      ).resolves.toEqual([MOCK_OBJECTS.FLAG]);
    });
  });

  describe('getUserFlags', () => {
    it('The function should return an array', () => {
      expect.assertions(1);
      return expect(driver.getUserFlags({
        username: MOCK_OBJECTS.USERNAME,
      }))
      .resolves
      .toEqual([MOCK_OBJECTS.FLAG]);
    });
  });

  describe('getLearningObjectFlags', () => {
    it('Fetch all flags for a given learning object', () => {
      expect.assertions(1);
      return expect(driver.getLearningObjectFlags({
        learningObjectId: MOCK_OBJECTS.LEARNING_OBJECT_ID,
      }))
      .resolves
      .toEqual([MOCK_OBJECTS.FLAG]);
    });
  });

  afterAll(() => {
    MongoDriver.disconnect();
    console.log('Disconnected from Database');
  });
});
