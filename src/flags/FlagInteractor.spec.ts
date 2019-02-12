import { expect } from 'chai';
import { MockDriver } from '../drivers/MockDriver';
import { MOCK_OBJECTS } from '../tests/mocks';
import * as interactor from './FlagInteractor';

const driver = new MockDriver();

let ratingId: string;

describe('flagRating', () => {
  it('Should return error - author of rating cannot perform this action!', done => {
    return interactor.flagRating({
      dataStore: driver,
      ratingId,
      currentUsername: MOCK_OBJECTS.USERNAME,
      flag: MOCK_OBJECTS.FLAG,
    }).then(val => {
      console.log(val);
      expect.fail();
      done();
    }).catch((error) => {
      expect(error).to.be.a('string');
      done();
    });
  });
  it('Should flag the rating created during test 1', done => {
    return interactor.flagRating({
      dataStore: driver,
      ratingId,
      currentUsername: MOCK_OBJECTS.USERNAME_OTHER,
      flag: MOCK_OBJECTS.FLAG,
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

describe('getAllFlags', () => {
  it('Should return all flags - this is an admin operation', done => {
    return interactor.getAllFlags({
        dataStore: driver,
    }).then(val => {
      expect(val).to.be.an('array');
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

describe('getUserFlags', () => {
  it('Should return all flags for a specified user - this is an admin operation', done => {
    return interactor.getUserFlags({
        dataStore: driver,
        username: MOCK_OBJECTS.USERNAME,
    }).then(val => {
      expect(val).to.be.an('array');
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

describe('getRatingFlags', () => {
  it('Should return all flags for a specified rating - this is an admin operation', done => {
    return interactor.getRatingFlags({
      dataStore: driver,
      ratingId,
    }).then(val => {
      expect(val).to.be.an('array');
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

