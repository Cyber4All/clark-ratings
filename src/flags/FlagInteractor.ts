import { Flag } from '../types/Rating';
import { FlagStore } from './FlagDataStore';
import { FlagDataStore } from './interfaces/FlagDataStore';

/**
 * Create a flag for a specified rating
 * @export
 * @param {{
 *   ratingId: string;
 *   currentUsername: string;
 *   flag: Flag
 * }}
 * @returns Promise<void>
 */

export class FlagInteractor {

    private dataStore: FlagDataStore;

    constructor() {
        this.dataStore = new FlagStore();
    }

    async flagRating(params: {
        ratingId: string;
        currentUsername: string;
        flag: Flag;
    }): Promise<void> {
        try {
            if (!hasAccess) {
                await this.dataStore.flagRating(
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
     * }}
     * @returns Promise<Flag[]>
     */
    async getAllFlags(): Promise<Flag[]> {
        try {
            const flags = await this.dataStore.getAllFlags();
            return flags;
        } catch (error) {
            return Promise.reject(`Problem getting all flags (ADMIN). Error: ${error}`);
        }
    }

    /**
     * Fetch all flags for a given user
     * @export
     * @param {{
     *   username: string;
     * }}
     * @returns Promise<Flag[]>
     */
    async getUserFlags (params: {
        username:  string,
    }): Promise<Flag[]> {
        try {
            const flags = await this.dataStore.getUserFlags(params.username);
            return flags;
        } catch (error) {
            return Promise.reject(`Problem getting user flags (ADMIN). Error: ${error}`);
        }
    }

    /**
     * Fetch all flags for a given learning object
     * @export
     * @param {{
     *   learningObjectId: string;
     * }}
     * @returns Promise<Flag[]>
     */
    async getLearningObjectFlags (params: {
        learningObjectId: string,
    }): Promise<Flag[]> {
        try {
            const flags = await this.dataStore.getLearningObjectFlags(params.learningObjectId);
            return flags;
        } catch (error) {
            return Promise.reject(`Problem getting learning object flags (ADMIN). Error: ${error}`);
        }
    }

    /**
     * Fetch all flags for a given ratings
     * @export
     * @param {{
     *   ratingId: string;
     * }}
     * @returns Promise<Flag[]>
     */
    async getRatingFlags (params: {
        ratingId: string,
    }): Promise<Flag[]> {
        try {
            const flags = await this.dataStore.getRatingFlags(params.ratingId);
            return flags;
        } catch (error) {
            return Promise.reject(`Problem getting rating flags (ADMIN). Error: ${error}`);
        }
    }

    /**
     * Delete a flag
     * @export
     * @param {{
     *   flagId: string;
     * }}
     * @returns Promise<void>
     */
    async deleteFlag (params: {
        flagId: string,
    }): Promise<void> {
        try {
            await this.dataStore.deleteFlag(params.flagId);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(`Problem deleting flag (ADMIN). Error: ${error}`);
        }
    }
}

