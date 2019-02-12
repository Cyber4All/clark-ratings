import { DataStore } from '../interfaces/interfaces';
import { Flag } from '../types/Rating';

/**
 * Create a flag for a specified rating
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   ratingId: string;
 *   currentUsername: string;
 *   flag: Flag
 * }}
 * @returns Promise<void>
 */
export async function flagRating(params: {
    dataStore: DataStore;
    ratingId: string;
    currentUsername: string;
    flag: Flag;
}): Promise<void> {
    try {
        const isRatingAuthor = await this.checkRatingAuthor(
            params.currentUsername,
            params.ratingId,
            params.dataStore,
        );
        if (!isRatingAuthor) {
            await params.dataStore.flagRating(
                params.ratingId,
                params.flag,
            );
            return Promise.resolve();
        } else {
            return Promise.reject(
                'Error the author of the rating cannot perform this action!',
            );
        }
    } catch (error) {
        return Promise.reject(`Problem flaging rating. Error: ${error}`);
    }
}

/**
 * Fetch all flags
 * @export
 * @param {{
 *   dataStore: DataStore;
 * }}
 * @returns Promise<Flag[]>
 */
export async function getAllFlags(params: {
    dataStore: DataStore,
}): Promise<Flag[]> {
    try {
        const flags = await params.dataStore.getAllFlags();
        return flags;
    } catch (error) {
        return Promise.reject(`Problem getting all flags (ADMIN). Error: ${error}`);
    }
}

/**
 * Fetch all flags for a given user
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   username: string;
 * }}
 * @returns Promise<Flag[]>
 */
export async function getUserFlags (params: {
    dataStore: DataStore,
    username:  string,
}): Promise<Flag[]> {
    try {
        const flags = await params.dataStore.getUserFlags(params.username);
        return flags;
    } catch (error) {
        return Promise.reject(`Problem getting user flags (ADMIN). Error: ${error}`);
    }
}

/**
 * Fetch all flags for a given learning object
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   learningObjectId: string;
 * }}
 * @returns Promise<Flag[]>
 */
export async function getLearningObjectFlags (params: {
    dataStore: DataStore,
    learningObjectId: string,
}): Promise<Flag[]> {
    try {
        const flags = await params.dataStore.getLearningObjectFlags(params.learningObjectId);
        return flags;
    } catch (error) {
        return Promise.reject(`Problem getting learning object flags (ADMIN). Error: ${error}`);
    }
}

export async function getRatingFlags (params: {
    dataStore: DataStore,
    ratingId: string,
}): Promise<Flag[]> {
    try {
        const flags = await params.dataStore.getRatingFlags(params.ratingId);
        return flags;
    } catch (error) {
        return Promise.reject(`Problem getting rating flags (ADMIN). Error: ${error}`);
    }
}

export async function deleteFlag (params: {
    dataStore: DataStore,
    flagId: string,
}): Promise<void> {
    try {
        await params.dataStore.deleteFlag(params.flagId);
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(`Problem deleting flag (ADMIN). Error: ${error}`);
    }
}

