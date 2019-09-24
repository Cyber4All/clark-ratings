/**
 * Dispatch Rating Notification when triggered
 */
export interface RatingNotifier {

    /**
     * Posts a message on slack when triggered..
     *
     * @param ratingAuthor [the username of the user that created the rating]
     * @param ratingComment [the comment that was left with the rating]
     * @param learningObjectName [the name of the Learning Object]
     * @param learningObjectAuthorUsername [the username of the user that created the Learning Object]
     */
    sendRatingNotification(params: {
        ratingAuthor: string;
        ratingComment: string;
        learningObjectName: string;
        learningObjectAuthorUsername: string;
    }): Promise<void>;
}
