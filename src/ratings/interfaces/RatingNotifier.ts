/**
 * Dispatch Rating Notification when triggered
 */
export interface RatingNotifier {

    /**
     * Sends a message on slack when triggered using a post request
     *
     * @param ratingAuthor [the username of the user that created the rating]
     * @param ratingComment [the comment that was left with the rating]
     * @param loName [the name of the learning object]
     * @param loAuthor [the username of the user that created the learning object]
     */
    sendRatingNotification(ratingAuthor: string, ratingComment: string, loName: string, loAuthor: string): Promise<void>;
}
