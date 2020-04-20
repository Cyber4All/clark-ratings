import { RatingNotifier } from '../../interfaces/RatingNotifier';
import { Rating } from '../../../types/Rating';
import { createRating } from '../RatingsInteractor';
import { UserToken } from '../../../types/UserToken';

class StubNotifier implements RatingNotifier {
    sendRatingNotification(params: {
        ratingAuthor: string;
        ratingComment: string;
        learningObjectCuid: string;
        learningObjectAuthorUsername: string;
    }): Promise<void> {
        return;
    }
}

const stubRating: Rating = {
    value: 0,
    comment: 'test comment',
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
            createNewRating: jest
                .fn()
                .mockResolvedValue( Promise.resolve() ),
        }),
    },
}));

jest.mock('../../../drivers/LearningObjectServiceConnector', () => ({
    __esModule: true,
    getLearningObject: jest.fn(),
}));

import { getLearningObject } from '../../../drivers/LearningObjectServiceConnector';

describe('When createRating is called', () => {
    describe('and the requester is the author of the Learning Object', () => {
        it('should throw an invalid access error', async () => {
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
            await expect(createRating({
                username: 'test_username',
                rating: stubRating,
                CUID: 'test_CUID',
                version: 'test_version',
                user: { ...stubUserToken, username: 'learning_object_author' },
                ratingNotifier: new StubNotifier(),
            }))
            .rejects
            .toThrowError('Invalid Access');
        });
    });
    describe('and the requester is not the author of the Learning Object', () => {
        describe('and the Learning Object does not exist', () => {
            it('should throw a not found error', async () => {
                getLearningObject['mockImplementation']((params: {
                    CUID: string;
                    version: string;
                }): any => null);
                await expect(createRating({
                    username: 'test_username',
                    rating: stubRating,
                    CUID: 'test_CUID',
                    version: 'test_version',
                    user: { ...stubUserToken, username: 'learning_object_author' },
                    ratingNotifier: new StubNotifier(),
                }))
                .rejects
                .toThrowError('Learning Object not found');
            });
        });
        describe('and the Learning Object does exist', () => {
            it('should call sendRatingNotification', async () => {
                getLearningObject['mockImplementation']((params: {
                    CUID: string;
                    version: string;
                }): any => {
                    return {
                        author: {
                            username: 'learning_object_author',
                        },
                        status: 'released',
                    };
                });
                await expect(createRating({
                    username: 'test_username',
                    rating: stubRating,
                    CUID: 'test_CUID',
                    version: 'test_version',
                    user: { ...stubUserToken },
                    ratingNotifier: new StubNotifier(),
                }))
                .resolves
                .not
                .toThrowError();
            });

            it('should throw an error for a not released object', async () => {
                getLearningObject['mockImplementation']((params: {
                    CUID: string;
                    version: string;
                }): any => {
                    return {
                        author: {
                            username: 'learning_object_author',
                        },
                        status: 'waiting',
                    };
                });
                await expect(createRating({
                    username: 'test_username',
                    rating: stubRating,
                    CUID: 'test_CUID',
                    version: 'test_version',
                    user: { ...stubUserToken },
                    ratingNotifier: new StubNotifier(),
                }))
                .resolves
                .toThrowError();
            });
        });
    });
});
