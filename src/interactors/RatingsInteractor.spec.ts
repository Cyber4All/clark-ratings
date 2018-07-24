import { RatingsInteractor } from './RatingsInteractor';
import { MongoDriver } from '../drivers/MongoDriver';
import { expect } from 'chai';
import { Rating } from '../types/Rating';

const driver = new MongoDriver();
const interactor = new RatingsInteractor();

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
      number: 4,
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
    });
  });
});




