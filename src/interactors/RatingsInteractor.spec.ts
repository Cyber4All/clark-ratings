import { RatingsInteractor } from './RatingsInteractor';
import { AdminRatingsInteractor } from './AdminRatingsInteractor';
import { expect } from 'chai';
import { Rating, Flag } from '../types/Rating';
import { LokiDriver } from '../drivers/LokiDriver';
import { MOCK_OBJECTS } from '../../tests/mocks';

const driver = new LokiDriver();
const interactor = new RatingsInteractor();
const adminInteractor = new AdminRatingsInteractor();
let ratingId: string; 

describe('createNewRating', () => {
  it('Should create a new rating object', done => {
    jest.setTimeout(30000);
    return interactor.createNewRating(
      driver, 
      MOCK_OBJECTS.RATING,
      MOCK_OBJECTS.LEARNING_OBJECT_NAME, 
      MOCK_OBJECTS.LEARNING_OBJECT_AUTHOR, 
      MOCK_OBJECTS.USERNAME, 
      MOCK_OBJECTS.EMAIL, 
      MOCK_OBJECTS.NAME
    ).then(val => {
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
    return interactor.getLearningObjectRatings(
      driver, 
      MOCK_OBJECTS.LEARNING_OBJECT_NAME, 
      MOCK_OBJECTS.LEARNING_OBJECT_AUTHOR
    ).then(val => {
      ratingId = val['ratings'][0]['_id'];
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
    return interactor.updateRating(
      driver, 
      ratingId, 
      MOCK_OBJECTS.LEARNING_OBJECT_NAME, 
      MOCK_OBJECTS.LEARNING_OBJECT_AUTHOR, 
      MOCK_OBJECTS.EDIT_RATING, 
      MOCK_OBJECTS.USERNAME
    ).then(val => {
      console.log(val);
      expect.fail();
      done();
    }).catch((error) => {
      expect(error).to.be.a('string');
      done();
    });
  });
  it('Should update the rating object created in first test', done => {
    return interactor.updateRating(
      driver, 
      ratingId, 
      MOCK_OBJECTS.LEARNING_OBJECT_NAME, 
      MOCK_OBJECTS.LEARNING_OBJECT_AUTHOR, 
      MOCK_OBJECTS.EDIT_RATING, 
      MOCK_OBJECTS.USERNAME
    ).then(val => {
      expect(val).to.be.an('undefined');
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

describe('flagRating', () => {
  it('Should return error - author of rating cannot perform this action!', done => {
    return interactor.flagRating(
      driver, 
      ratingId, 
      MOCK_OBJECTS.USERNAME, 
      MOCK_OBJECTS.FLAG
    ).then(val => {
      console.log(val);
      expect.fail();
      done();
    }).catch((error) => {
      expect(error).to.be.a('string');
      done();
    });
  });
  it('Should flag the rating created during test 1', done => {
    return interactor.flagRating(
      driver, 
      ratingId, 
      MOCK_OBJECTS.USERNAME_OTHER, 
      MOCK_OBJECTS.FLAG
    ).then(val => {
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
    return adminInteractor.getAllFlags(driver).then(val => {
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
    return adminInteractor.getUserFlags(driver, MOCK_OBJECTS.USERNAME).then(val => {
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
    return adminInteractor.getRatingFlags(
      driver, 
      MOCK_OBJECTS.LEARNING_OBJECT_NAME, 
      MOCK_OBJECTS.LEARNING_OBJECT_AUTHOR, 
      ratingId
    ).then(val => {
      expect(val).to.be.an('array');
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
    return interactor.deleteRating(
      driver, 
      ratingId, 
      MOCK_OBJECTS.LEARNING_OBJECT_NAME, 
      MOCK_OBJECTS.LEARNING_OBJECT_AUTHOR, 
      MOCK_OBJECTS.USERNAME_OTHER
    ).then(val => {
      console.log(val);
      expect.fail();
      done();
    }).catch((error) => {
      expect(error).to.be.a('string');
      done();
    });
  });
  it('Should delete the rating created during test 1', done => {
    return interactor.deleteRating(
      driver, 
      ratingId, 
      MOCK_OBJECTS.LEARNING_OBJECT_NAME, 
      MOCK_OBJECTS.LEARNING_OBJECT_AUTHOR, 
      MOCK_OBJECTS.USERNAME
    ).then(val => {
      expect(val).to.be.an('undefined');
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

describe('getRatingFlags - after', () => {
  it('Check flags after rating was deleted. Associated flags should be deleted at this point.', done => {
    return adminInteractor.getRatingFlags(
      driver, 
      MOCK_OBJECTS.LEARNING_OBJECT_NAME, 
      MOCK_OBJECTS.LEARNING_OBJECT_AUTHOR, 
      ratingId
    ).then(val => {
      expect(val).to.be.empty;
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

afterAll(() => {
  // driver.disconnect();
  console.log('Disconnected from database');
});



