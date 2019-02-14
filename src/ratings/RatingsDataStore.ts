async updateRating(ratingId: string, updatedRating: Rating): Promise<void> {
    try {
      await this.db.collection(Collections.ratings)
        .findOneAndUpdate(
          { _id: new ObjectID(ratingId) },
          { $set: { value: updatedRating.value, comment: updatedRating.comment, date: Date.now() },
        });
      return Promise.resolve();
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }

  async deleteRating(
    ratingId: string,
  ): Promise<void> {
    try {
      await this.db.collection(Collections.ratings).findOneAndDelete({ _id: new ObjectID(ratingId) });
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }

  async getRating(ratingId: string): Promise<Rating> {
    try {
      return (await this.db.collection(Collections.ratings).find({ _id: new ObjectId(ratingId) }).toArray())[0];
    } catch (error) {
      reportError(error);
      return Promise.reject('Problem retrieving rating! Error: ' + error);
    }
  }

  async getLearningObjectsRatings(
    learningObjectId: string,
  ): Promise<LearningObjectContainer> {
    try {
      const data = await this.db.collection(Collections.ratings).aggregate([
        {
          $match: { source: learningObjectId },
        },
        {
          $sort: { date: 1 },
        },
        {
          $group: {
            _id: '$source',
            avgValue: {
              $avg: '$value',
            },
            ratings: {
              $push: {
                _id: '$_id',
                value: '$value',
                user: '$user',
                comment: '$comment',
                date: '$date',
              },
            },
          },
        },
      ]).toArray();

      return data[0];
    } catch (error) {
      reportError(error);
      return Promise.reject(error);
    }
  }

  async createNewRating(
    rating: Rating,
    learningObjectId: string,
    username: string,
    email: string,
    name: string,
  ): Promise<void> {
    // TODO implement this
  }

