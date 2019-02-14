import { DataStore } from '../interfaces/interfaces';
import { ResourceError, ResourceErrorReason } from '../errors';
import { userInfo } from 'os';
import { LEARNING_OBJECT_SERVICE_ROUTES } from '../routes';
import { Rating } from '../types/Rating';
import { getLearningObject } from '../drivers/LearningObjectServiceConnector';
import { UserToken, UserRole } from '../types/UserToken';
import { getUser } from '../drivers/UserServiceConnector';

/**
 * Checks if a user has the authority to update a Rating
 *
 * @export
 * @typedef {Object} params
 * @property {DataStore} dataStore instance of DataStore
 * @property {UserToken} user UserToken object
 * @property {string} ratingId id of specified rating
 *
 * @returns Promise<boolean>/
 */
export async function hasRatingUpdateAccess(params: {
    dataStore: DataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    return(
        await isRatingAuthor({
            dataStore: params.dataStore,
            user: params.user,
            ratingId: params.ratingId,
        })
    );
}

/**
 * Checks if a user has the authority to delete a Rating
 *
 * @export
 * @typedef {Object} params
 * @property {DataStore} dataStore instance of DataStore
 * @property {UserToken} user UserToken object
 * @property {string} ratingId id of specified rating
 *
 * @returns Promise<boolean>/
 */
export async function hasRatingDeleteAccess(params: {
    dataStore: DataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    return(
        await isRatingAuthor({
            dataStore: params.dataStore,
            user: params.user,
            ratingId: params.ratingId,
        }) ||
        await hasPrivilegedAccess({
            dataStore: params.dataStore,
            user: params.user,
            ratingId: params.ratingId,
        })
    );
}


/**
 * Checks if a user has the authority to create a response
 *
 * @export
 * @typedef {Object} params
 * @property {DataStore} dataStore instance of DataStore
 * @property {UserToken} user UserToken object
 * @property {string} ratingId id of specified rating
 *
 * @returns Promise<boolean>/
 */
export async function hasResponseCreationAccess(params: {
    dataStore: DataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    return(
        await isLearningObjectAuthor({
            dataStore: params.dataStore,
            ratingId: params.ratingId,
        }) ||
        await isLearningObjectContributor({
            dataStore: params.dataStore,
            user: params.user,
            ratingId: params.ratingId,
        })
    );
}

async function isLearningObjectAuthor(params: {
    dataStore: DataStore;
    ratingId: string;
}): Promise<boolean> {
    try {
        const rating = await fetchRating({
            dataStore: params.dataStore,
            ratingId: params.ratingId,
        });
        const learningObject = await getLearningObject(rating.source);
        const user = await getUser(rating.user.username);
        if (learningObject['authorID'] === user['id']) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return Promise.reject(
            new ResourceError(
                'Learning Object not found',
                ResourceErrorReason.NOT_FOUND,
            ),
        );
    }
}

async function isLearningObjectContributor(params: {

}): Promise<boolean> {
    try {
        //
    } catch (error) {
        return Promise.reject(
            new ResourceError(
                'Learning Object not found',
                ResourceErrorReason.NOT_FOUND,
            ),
        );
    }
}

async function isRatingAuthor(params: {
    dataStore: DataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    try {
        const rating = await this.fetchRating({
            dataStore: params.dataStore,
            ratingId: params.ratingId,
        });
        if (rating.user.username === params.user.username) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return Promise.reject(
            new ResourceError(
                'User is not author of the specified rating',
                ResourceErrorReason.INVALID_ACCESS,
            ),
        );
    }
}

async function hasPrivilegedAccess(params: {
    dataStore: DataStore;
    user: UserToken;
    ratingId: string;
}): Promise<boolean> {
    try {
        if (params.user.accessGroups) {
            if (isAdminOrEditor(params.user.accessGroups)) {
                return true;
            } else {
                return checkCollectionWriteAccess({
                    user: params.user,
                    dataStore: params.dataStore,
                    ratingId: params.ratingId,
                });
            }
        } else {
            return false;
        }
    } catch (error) {
        return Promise.reject(
            new ResourceError(
                'User is not a member of required access group',
                ResourceErrorReason.INVALID_ACCESS,
            ),
        );
    }
}

/**
 * Checks if accessGroups contains admin or editor
 *
 * @param {string[]} accessGroups
 * @returns {boolean}
 */
function isAdminOrEditor(accessGroups: string[]): boolean {
    return (
      accessGroups.includes(UserRole.ADMIN) ||
      accessGroups.includes(UserRole.EDITOR)
    );
}

/**
 * Checks if a user has the authority to update the data of a particular collection.
 *
 * @param user UserToken
 * @param dataStore Instance of datastore
 * @param objectId Can be a learning object id or learning name
 */
async function checkCollectionWriteAccess(params: {
    user: UserToken;
    dataStore: DataStore;
    ratingId: string;
  }): Promise<boolean> {
    try {
        const rating = await fetchRating({
            dataStore: params.dataStore,
            ratingId: params.ratingId,
        });
        const learningObject = await getLearningObject(rating.source);
        const collections = getAccessGroupCollections(params.user);
        if (collections.includes(learningObject['collection'])) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return Promise.reject(
            new ResourceError(
                'User is not a member of required access group',
                ResourceErrorReason.INVALID_ACCESS,
            ),
        );
    }
}

async function fetchRating(params: {
    dataStore: DataStore;
    ratingId: string;
}): Promise<Rating> {
    try {
        const rating = await params.dataStore.getRating(params.ratingId);
        return rating;
    } catch (error) {
        return Promise.reject(
            new ResourceError(
                'Rating not found',
                ResourceErrorReason.NOT_FOUND,
            ),
        );
    }
}

/**
 * Returns collections within user's accessGroups
 *
 * @export
 * @param {UserToken} userToken
 * @returns
 */
function getAccessGroupCollections(userToken: UserToken) {
    const collections = [];
    for (const group of userToken.accessGroups) {
      const access = group.split('@');
      collections.push(access[1]);
    }
    return collections.filter(collection => !!collection);
}






