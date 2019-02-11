export async function flagRating(params: {
    dataStore: DataStore,
    ratingId: string,
    currentUsername: string,
    flag: Flag,
    ): Promise<void> {
        try {
            const isRatingAuthor = await this.checkRatingAuthor(
            currentUsername,
            ratingId,
            dataStore,
            );
            if (!isRatingAuthor) {
            await dataStore.flagRating(ratingId, flag);
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