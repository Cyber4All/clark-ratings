import { Request, Response, Router } from 'express';
import { DataStore } from '../interfaces/DataStore';
import { getLearningObjectRatings, getRating, deleteRating, createNewRating, updateRating } from './RatingsInteractor';

/**
 * Initializes an express router with endpoints for public retrieving
 * of Ratings.
 */
export function initializePublic({
    router,
    dataStore,
  }: {
    router: Router;
    dataStore: DataStore;
  }) {
    /**
     * Retrieve a learning object by a specified ID
     * @param {Request} req
     * @param {Response} res
     */
    const getSingleRating = async (req: Request, res: Response) => {
        try {
          const rating = await getRating({
            dataStore: this.dataStore,
            ratingId: req.params.ratingId,
          });
          res.send(200).json(rating);
        } catch (error) {
          res.sendStatus(500);
        }
    };

    const getObjectRatings = async (req: Request, res: Response) => {
        try {
            const ratings = await getLearningObjectRatings({
              dataStore: this.dataStore,
              learningObjectId: req.params.learningObjectId,
            });
            res.send(200).json(ratings);
          } catch (error) {
            res.sendStatus(500);
          }
    };

    router.get('/ratings/:ratingId', getRating);
    router.get('/learning-objects/:learningObjectId/ratings', getObjectRatings);

    return router;
  }

/**
 * Initializes an express router with endpoints for public Creating, Updating, and Deleting
 * a Learning Object.
 *
 * @export
 * @param {{
 *   dataStore: DataStore;
 *   fileManager: FileManager;
 *   library: LibraryCommunicator;
 * }} {
 *   dataStore,
 *   fileManager,
 *   library,
 * }
 * @returns
 */
export function initializePrivate({
    router,
    dataStore,
}: {
    router: Router;
    dataStore: DataStore;
}) {

    const removeRating = async (req: Request, res: Response) => {
        // delete specified rating
        const ratingId = req.params.ratingId;
        const learningObjectName = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const currentUsername = req['user']['username'];
        try {
          await deleteRating({
            dataStore: this.dataStore,
            ratingId,
            learningObjectName,
            learningObjectAuthor,
            currentUsername,
          });
          res.sendStatus(200);
        } catch (error) {
          res.send(500).json({message: error.message});
        }
    };

    const editRating = async (req: Request, res: Response) => {
        // update specified rating
        const updates = req.body;
        const ratingId = req.params.ratingId;
        const learningObjectName = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const currentUsername = req['user']['username'];
        try {
          await updateRating({
            dataStore: this.dataStore,
            ratingId,
            learningObjectName,
            learningObjectAuthor,
            updates,
            currentUsername,
          });
          res.sendStatus(200);
        } catch (error) {
          res.send(500).json({message: error.message});
        }
    };

    const createRating = async (req: Request, res: Response) => {
        // create a new rating for the associated learning object
        const rating = req.body;
        const learningObjectName = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const username = req['user']['username'];
        const email = req['user']['email'];
        const name = req['user']['name'];
        try {
          await createNewRating({
            dataStore: this.dataStore,
            rating,
            learningObjectName,
            learningObjectAuthor,
            username,
            email,
            name,
          });
          res.sendStatus(200);
        } catch (error) {
          res.send(500).json({message: error.message});
        }
    };

    router.delete('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId', removeRating);
    router.patch('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId', editRating);
    router.post('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings', createRating);
}
