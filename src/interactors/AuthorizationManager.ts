import { DataStore } from '../interfaces/interfaces';

/**
 * Checks if a user has the authority to modify a Rating
 * or Response object.
 *
 * objectId can reference a rating or a response object
 *
 * @export
 * @param {{
 *   user: UserToken;
 *   dataStore: DataStore;
 *   objectId: string;
 * }}
 *
 * @returns Promise<boolean>/
 */
export async function hasWriteAccess(params: {
    user: UserToken;
    dataStore: DataStore;
    objectId: string;
}): Promise<boolean> {
    return hasPrivilegedAccess()
}