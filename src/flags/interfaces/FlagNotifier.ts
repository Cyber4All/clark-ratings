/**
 * Dispatch flag notification when triggered
 */
export interface FlagNotifier {

    /**
     * Posts a message on slack when triggered using a post request.
     * @param username the name of the user who flagged the rating comment
     * @param ratingComment the comment that has been flagged
     * @param loName the name of the learning object
     * @param loAuthor the username of the user who created the learning object
     */
    sendFlagNotification(username: string, ratingComment: string, loName: string, loAuthor: string): Promise<void>;
}
