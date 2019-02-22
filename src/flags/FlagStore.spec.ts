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

  describe('getAllFlags', () => {
    it('Should return array of all documents in flags collection', () => {
      expect.assertions(1);
      return expect(
        driver.getAllFlags(),
      ).resolves.toEqual(MOCK_OBJECTS.FLAG_REPSONSE);
    });
  });

  describe('flagRating', () => {
    it('Should insert a document into the flags collection', () => {
      expect.assertions(1);
      return expect(driver.flagRating({
        ratingId: MOCK_OBJECTS.RATING._id,
        flag: MOCK_OBJECTS.FLAG,
      }))
      .resolves
      .toBeUndefined();
    });
  });

  afterAll(() => {
    MongoDriver.disconnect();
    console.log('Disconnected from Database');
  });
});
