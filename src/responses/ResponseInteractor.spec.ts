
import { MOCK_OBJECTS } from './mocks/MockObjects';
import * as interactor from './ResponseInteractor';
import { MockResponseStore } from './mocks/MockResponseStore';

const driver = new MockResponseStore();

describe('deleteResponse', () => {
  it('Should delete a response', () => {
      expect.assertions(1);
      return expect (interactor.deleteResponse({
        dataStore: driver,
        responseId: MOCK_OBJECTS.RESPONSE._id,
      }))
      .resolves
      .toBeUndefined();
  });
});

describe('updateResponse', () => {
  it('Should update response', () => {
    expect.assertions(1);
    return expect (interactor.updateResponse({
        dataStore: driver,
        responseId: MOCK_OBJECTS.RESPONSE._id,
        updates: MOCK_OBJECTS.RESPONSE,
    }))
    .resolves
    .toBeUndefined();
  });
});

describe('createResponse', () => {
  it('Should create a response', () => {
    expect.assertions(1);
    return expect (interactor.createResponse({
        dataStore: driver,
        ratingId: MOCK_OBJECTS.RESPONSE._id,
        response: MOCK_OBJECTS.RESPONSE,
    }))
    .resolves
    .toBeUndefined();
  });
});
