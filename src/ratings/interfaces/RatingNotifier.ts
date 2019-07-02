export interface RatingNotifier {
    sendRatingNotification(ratingAuthor: string, ratingComment: string, loName: string, loAuthor: string): Promise<void>;
}
