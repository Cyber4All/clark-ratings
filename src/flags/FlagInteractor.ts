import { Flag } from '../types/Flag';
import { FlagDataStore } from './interfaces/FlagDataStore';

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
    dataStore: FlagDataStore;
    ratingId: string;
    currentUsername: string;
    flag: Flag;
}): Promise<void> {
    try {
        await params.dataStore.flagRating({
            ratingId: params.ratingId,
            flag: params.flag,
        });
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
    dataStore: FlagDataStore,
}): Promise<Flag[]> {
    try {
        const flags = await params.dataStore.getAllFlags();
        return flags;
    } catch (error) {
        return Promise.reject(`Problem getting all flags (ADMIN). Error: ${error}`);
    }
}

/**
 * Fetch all flags for a given ratings
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   ratingId: string;
 * }}
 * @returns Promise<Flag[]>
 */
export async function getRatingFlags (params: {
    dataStore: FlagDataStore,
    ratingId: string,
}): Promise<Flag[]> {
    try {
        const flags = await params.dataStore.getRatingFlags({
            ratingId: params.ratingId,
        });
        return flags;
    } catch (error) {
        return Promise.reject(`Problem getting rating flags (ADMIN). Error: ${error}`);
    }
}

/**
 * Delete a flag
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   flagId: string;
 * }}
 * @returns Promise<void>
 */
export async function deleteFlag (params: {
    dataStore: FlagDataStore,
    flagId: string,
}): Promise<void> {
    try {
        await params.dataStore.deleteFlag({
            flagId: params.flagId,
        });
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(`Problem deleting flag (ADMIN). Error: ${error}`);
    }
}

