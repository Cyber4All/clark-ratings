import { Rating } from '../../../types/Rating';
import { UserToken } from '../../../types/UserToken';
import { updateRating } from '../RatingsInteractor';

const stubRating: Rating = {
    value: 0,
    comment: 'test comment',
    user: {
        username: 'test_username',
        name: 'test_name',
        email: 'test_email',
    },
};

const stubUpdates: Rating = {
    value: 1,
    comment: 'updated test comment',
};

const stubUserToken: UserToken = {
    username: 'test_username',
    name: 'test_name',
    email: 'test_email',
    organization: 'test_organization',
    emailVerified: true,
    accessGroups: [''],
};

jest.mock('../../RatingStore', () => ({
    __esModule: true,
    RatingStore: {
      getInstance: () => ({
        updateRating: jest
            .fn()
            .mockResolvedValue( Promise.resolve() ),
        getRating: jest
            .fn()
            .mockResolvedValue( stubRating ),
      }),
    },
}));

jest.mock('../../../drivers/LearningObjectServiceConnector', () => ({
    __esModule: true,
    getLearningObject: jest.fn(),
}));

import { getLearningObject } from '../../../drivers/LearningObjectServiceConnector';

describe('When updateRating is called', () => {
    describe('and the requester is not the author of the rating', () => {
        it('should throw an invalid access error', async () => {
            await expect(updateRating({
                ratingID: 'test_ratingID',
                CUID: 'test_CUID',
                updates: stubUpdates,
                version: 'test_version',
                user: { ...stubUserToken, accessGroups: [''], username: 'not_author' },
            }))
            .rejects
            .toThrowError('Invalid Access');
        });
    });
    describe('and the requester is the author of the rating', () => {
        describe('and the Learning Object does not exist', () => {
            it('should throw a not found error', async () => {
                getLearningObject['mockImplementation']((params: {
                    CUID: string;
                    version: string;
                }): any => {
                    return null;
                });

                await expect(updateRating({
                    ratingID: 'test_ratingID',
                    CUID: 'test_CUID',
                    updates: stubUpdates,
                    version: 'test_version',
                    user: { ...stubUserToken },
                }))
                .rejects
                .toThrowError('does not exist');
            });
        });
        describe('and the Learning Object does exist', () => {
            it('should resolve and not throw an error', async () => {
                getLearningObject['mockImplementation']((params: {
                    CUID: string;
                    version: string;
                }): any => {
                    return {
                        author: {
                            username: 'learning_object_author',
                        },
                    };
                });

                await expect(updateRating({
                    ratingID: 'test_ratingID',
                    CUID: 'test_CUID',
                    updates: stubUpdates,
                    version: 'test_version',
                    user: { ...stubUserToken },
                }))
                .resolves
                .not
                .toThrowError();
            });
        });
    });
});
