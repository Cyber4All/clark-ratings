import { expect } from 'chai';
import { MockDriver } from '../drivers/MockDriver';
import { MOCK_OBJECTS } from '../tests/mocks';
import * as interactor from './RatingsInteractor';

const driver = new MockDriver();

let ratingId: string;

describe('createNewRating', () => {
  it('Should create a new rating object', done => {
    jest.setTimeout(30000);
    return interactor.createRating({
      dataStore: driver,
      rating: MOCK_OBJECTS.RATING,
      learningObjectId: MOCK_OBJECTS.LEARNING_OBJECT_ID,
      username: MOCK_OBJECTS.USERNAME,
      email: MOCK_OBJECTS.EMAIL,
      name: MOCK_OBJECTS.NAME,
    }).then(val => {
      expect(val).to.be.an('undefined');
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

describe('getLearningObjectRatings', () => {
  it('Should get rating created in first test', done => {
    return interactor.getLearningObjectRatings({
      dataStore: driver,
      learningObjectId: MOCK_OBJECTS.LEARNING_OBJECT_ID,
    }).then(val => {
      expect(val).to.be.an('object');
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

describe('updateRating', () => {
  it('Should throw error - only author of rating can do this', done => {
    return interactor.updateRating({
      dataStore: driver,
      ratingId,
      updates: MOCK_OBJECTS.EDIT_RATING,
      currentUsername: MOCK_OBJECTS.USERNAME_OTHER,
    }).then(val => {
      console.log(val);
      expect.fail();
      done();
    }).catch((error) => {
      expect(error).to.be.a('string');
      done();
    });
  });
  it('Should update the rating object created in first test', done => {
    return interactor.updateRating({
      dataStore: driver,
      ratingId,
      updates: MOCK_OBJECTS.EDIT_RATING,
      currentUsername: MOCK_OBJECTS.USERNAME,
    }).then(val => {
      expect(val).to.be.an('undefined');
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

describe('deleteRating', () => {
  it('Should throw error - only the author of rating can do this', done => {
    return interactor.deleteRating({
      dataStore: driver,
      ratingId,
      currentUsername: MOCK_OBJECTS.USERNAME_OTHER,
    }).then(val => {
      console.log(val);
      expect.fail();
      done();
    }).catch((error) => {
      expect(error).to.be.a('string');
      done();
    });
  });
  it('Should delete the rating created during test 1', done => {
    return interactor.deleteRating({
      dataStore: driver,
      ratingId,
      currentUsername: MOCK_OBJECTS.USERNAME,
    }).then(val => {
      expect(val).to.be.an('undefined');
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});




