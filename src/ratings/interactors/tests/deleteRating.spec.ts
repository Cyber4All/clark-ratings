import { deleteRating } from '../RatingsInteractor';
import { UserToken } from '../../../types/UserToken';

const stubRating: Rating = {
    value: 0,
    comment: 'test comment',
    user: {
        username: 'test_username',
        name: 'test_name',
        email: 'test_email',
    },
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
        getRating: jest
            .fn()
            .mockResolvedValue({ ...stubRating }),
        deleteRating: jest
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
import { Rating } from '../../../types/Rating';
import { RatingStore } from '../../RatingStore';

describe('When deleteRating is called', () => {
    describe('and the requester is an admin', () => {
        describe('and the Learning Object does not exist', () => {
            it('should throw a not found error', async () => {
                getLearningObject['mockImplementation']((params: {
                    CUID: string;
                    version: string;
                }): any => {
                    return null;
                });

                await expect(deleteRating({
                    ratingID: 'test_ratingID',
                    CUID: 'test_CUID',
                    version: 'test_version',
                    user: { ...stubUserToken, accessGroups: ['admin'] },
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

                await expect(deleteRating({
                    ratingID: 'test_ratingID',
                    CUID: 'test_CUID',
                    version: 'test_version',
                    user: { ...stubUserToken, accessGroups: ['admin'] },
                }))
                .resolves
                .not
                .toThrowError();
            });
        });
    });
    describe('and the requester is an editor', () => {
        describe('and the Learning Object does not exist', () => {
            it('should throw a not found error', async () => {
                getLearningObject['mockImplementation']((params: {
                    CUID: string;
                    version: string;
                }): any => {
                    return null;
                });

                await expect(deleteRating({
                    ratingID: 'test_ratingID',
                    CUID: 'test_CUID',
                    version: 'test_version',
                    user: { ...stubUserToken, accessGroups: ['editor'] },
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

                await expect(deleteRating({
                    ratingID: 'test_ratingID',
                    CUID: 'test_CUID',
                    version: 'test_version',
                    user: { ...stubUserToken, accessGroups: ['editor'] },
                }))
                .resolves
                .not
                .toThrowError();
            });
        });
    });
    describe('and the requester is a curator', () => {
        it('should throw an invalid access error', async () => {
            await expect(deleteRating({
                ratingID: 'test_ratingID',
                CUID: 'test_CUID',
                version: 'test_version',
                user: { ...stubUserToken, accessGroups: ['curator@nccp'], username: 'not_author' },
            }))
            .rejects
            .toThrowError('Invalid Access');
        });
    });
    describe('and the requester is a reviewer', () => {
        it('Should throw an invalid access error', async () => {
            await expect(deleteRating({
                ratingID: 'test_ratingID',
                CUID: 'test_CUID',
                version: 'test_version',
                user: { ...stubUserToken, accessGroups: ['reviewer@nccp'], username: 'not_author' },
            }))
            .rejects
            .toThrowError('Invalid Access');
        });
    });
    describe('and the requester is the rating author', () => {
        describe('and the Learning Object does not exist', () => {
            it('should throw a not found error', async () => {
                getLearningObject['mockImplementation']((params: {
                    CUID: string;
                    version: string;
                }): any => {
                    return null;
                });

                await expect(deleteRating({
                    ratingID: 'test_ratingID',
                    CUID: 'test_CUID',
                    version: 'test_version',
                    user: { ...stubUserToken, accessGroups: [''] },
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

                await expect(deleteRating({
                    ratingID: 'test_ratingID',
                    CUID: 'test_CUID',
                    version: 'test_version',
                    user: { ...stubUserToken, accessGroups: [''] },
                }))
                .resolves
                .not
                .toThrowError();
            });
        });
    });
    describe('and the requester is not privileged and not the author', () => {
        it('Should throw an invalid access error', async () => {
            await expect(deleteRating({
                ratingID: 'test_ratingID',
                CUID: 'test_CUID',
                version: 'test_version',
                user: { ...stubUserToken, accessGroups: [''], username: 'not_author' },
            }))
            .rejects
            .toThrowError('Invalid Access');
        });
    });
});
