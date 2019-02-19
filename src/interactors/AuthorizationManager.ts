import { ResourceError, ResourceErrorReason } from '../errors';
import { Rating } from '../types/Rating';
import { getLearningObject } from '../drivers/LearningObjectServiceConnector';
import { UserToken, UserRole } from '../types/UserToken';
import { getUser } from '../drivers/UserServiceConnector';






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






