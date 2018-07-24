import { RatingsInteractor } from './RatingsInteractor';
import { MongoDriver } from '../drivers/MongoDriver';
import { expect } from 'chai';
import { Rating, Flag } from '../types/Rating';

const driver = new MongoDriver();
const interactor = new RatingsInteractor();
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
    const rating: Rating = {
      number:  4,
      comment: 'unit test'
    };
    const learningObjectName   = "Cybersecurity for Future Presidents";
    const learningObjectAuthor = "skaza";
    const username             = 'nvisal1';
    const email                = 'nvisal1@students.towson.edu';
    const name                 = 'nick visalli';
    return interactor.createNewRating(driver, rating, learningObjectName, learningObjectAuthor, username, email, name).then(val => {
      console.log(val);
      expect(val).to.exist;
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
    const learningObjectName   = "Cybersecurity for Future Presidents";
    const learningObjectAuthor = "skaza";
    return interactor.getLearningObjectRatings(driver, learningObjectName, learningObjectAuthor).then(val => {
      console.log(val);
      ratingId = val['ratings'][0]['_id'];
      expect(val).to.exist;
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

describe('updateRating', () => {
  it('Should update the rating object created in first test', done => {
    const editRating: Rating = {
      number:  3,
      comment: 'unit test edit'
    };
    const learningObjectName   = "Cybersecurity for Future Presidents";
    const learningObjectAuthor = "skaza";
    const username             = 'nvisal1';
    return interactor.updateRating(driver, ratingId, learningObjectName, learningObjectAuthor, editRating, username).then(val => {
      console.log(val);
      expect(val).to.exist;
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
      username: 'nvisal1',
      concern: 'unit test concern label'
    }
    const username = 'nvisal1';
    return interactor.flagRating(driver, ratingId, username, flag).then(val => {
      console.log(val);
      expect(val).to.exist;
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

describe('flagRating', () => {
  it('Should flag the rating created during test 1', done => {
    const flag: Flag = {
      comment: 'unit test flag',
      username: 'skaza',
      concern: 'unit test concern label'
    }
    const username = 'skaza';
    return interactor.flagRating(driver, ratingId, username, flag).then(val => {
      console.log(val);
      expect(val).to.exist;
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});

describe('deleteRating', () => {
  it('Should delete the rating created during test 1', done => {
    const flag: Flag = {
      comment: 'unit test flag',
      username: 'skaza',
      concern: 'unit test concern label'
    }
    const learningObjectName   = "Cybersecurity for Future Presidents";
    const learningObjectAuthor = "skaza";
    const username             = 'nvisal1';
    return interactor.deleteRating(driver, ratingId, learningObjectName, learningObjectAuthor, username).then(val => {
      console.log(val);
      expect(val).to.exist;
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail();
      done();
    });
  });
});



