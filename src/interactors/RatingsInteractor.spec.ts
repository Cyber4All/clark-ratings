import { RatingsInteractor } from './RatingsInteractor';
import { AdminRatingsInteractor } from './AdminRatingsInteractor';
import { MongoDriver } from '../drivers/MongoDriver';
import { expect } from 'chai';
import { Rating, Flag } from '../types/Rating';

const driver = new MongoDriver(process.env.CLARK_DB_URI_TEST);
const interactor = new RatingsInteractor();
const adminInteractor = new AdminRatingsInteractor();
let ratingId: string; 

beforeAll(done => {
     // Before running any tests, connect to database
     const dburi = process.env.CLARK_DB_URI_TEST;
     driver.connect(dburi).then(val => {
      console.log('connected to database');
      done();
    }).catch((error) => {
      console.log('failed to connect to database');
      done();
    });
});

describe('createNewRating', () => {
  it('Should create a new rating object', done => {
    jest.setTimeout(30000);
    const rating: Rating = {
      number:  4,
      comment: 'unit test'
    };
    const learningObjectName   = "test";
    const learningObjectAuthor = "nvisal1";
    const username             = 'cypress';
    const email                = 'test@test.com';
    const name                 = 'nick testing';
    return interactor.createNewRating(driver, rating, learningObjectName, learningObjectAuthor, username, email, name).then(val => {
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
    const learningObjectName   = "test";
    const learningObjectAuthor = "nvisal1";
    return interactor.getLearningObjectRatings(driver, learningObjectName, learningObjectAuthor).then(val => {
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
    const editRating: Rating = {
      number:  3,
      comment: 'unit test edit'
    };
    const learningObjectName   = "test";
    const learningObjectAuthor = "nvisal1";
    const username             = 'nvisal1';
    return interactor.updateRating(driver, ratingId, learningObjectName, learningObjectAuthor, editRating, username).then(val => {
      console.log(val);
      expect.fail();
      done();
    }).catch((error) => {
      expect(error).to.be.a('string');
      done();
    });
  });
  it('Should update the rating object created in first test', done => {
    const editRating: Rating = {
      number:  3,
      comment: 'unit test edit'
    };
    const learningObjectName   = "test";
    const learningObjectAuthor = "nvisal1";
    const username             = 'cypress';
    return interactor.updateRating(driver, ratingId, learningObjectName, learningObjectAuthor, editRating, username).then(val => {
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
    const flag: Flag = {
      comment: 'unit test flag',
      username: 'cypress',
      concern: 'unit test concern label'
    }
    const username = 'cypress';
    return interactor.flagRating(driver, ratingId, username, flag).then(val => {
      console.log(val);
      expect.fail();
      done();
    }).catch((error) => {
      expect(error).to.be.a('string');
      done();
    });
  });
  it('Should flag the rating created during test 1', done => {
    const flag: Flag = {
      comment: 'unit test flag',
      username: 'nvisal1',
      concern: 'unit test concern label'
    }
    const username = 'nvisal1';
    return interactor.flagRating(driver, ratingId, username, flag).then(val => {
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
    const username = 'cypress';
    return adminInteractor.getUserFlags(driver, username).then(val => {
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
  const learningObjectName   = "test";
  const learningObjectAuthor = "nvisal1";
  it('Should return all flags for a specified rating - this is an admin operation', done => {
    return adminInteractor.getRatingFlags(driver, learningObjectName, learningObjectAuthor, ratingId).then(val => {
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
    const learningObjectName   = "test";
    const learningObjectAuthor = "nvisal1";
    const username             = 'nvisal1';
    return interactor.deleteRating(driver, ratingId, learningObjectName, learningObjectAuthor, username).then(val => {
      console.log(val);
      expect.fail();
      done();
    }).catch((error) => {
      expect(error).to.be.a('string');
      done();
    });
  });
  it('Should delete the rating created during test 1', done => {
    const learningObjectName   = "test";
    const learningObjectAuthor = "nvisal1";
    const username             = 'cypress';
    return interactor.deleteRating(driver, ratingId, learningObjectName, learningObjectAuthor, username).then(val => {
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
  const learningObjectName   = "test";
  const learningObjectAuthor = "nvisal1";
  it('Check flags after rating was deleted. Associated flags should be deleted at this point.', done => {
    return adminInteractor.getRatingFlags(driver, learningObjectName, learningObjectAuthor, ratingId).then(val => {
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
  driver.disconnect();
  console.log('Disconnected from database');
});



