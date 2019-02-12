import { Request, Response, Router } from 'express';
import { DataStore } from '../interfaces/interfaces';
import * as interactor from './RatingsInteractor';
import { mapErrorToStatusCode } from '../errors';

/**
 * Initializes an express router with endpoints for public
 * rating functions
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
export function initializePublic({
    router,
    dataStore,
  }: {
    router: Router;
    dataStore: DataStore;
  }) {

    /**
     * Retrieve a rating by a specified ID
     * @param {Request} req
     * @param {Response} res
     */
    const getRating = async (req: Request, res: Response) => {
        try {
          const rating = await interactor.getRating({
            dataStore,
            ratingId: req.params.ratingId,
          });
          res.send(200).json(rating);
        } catch (error) {
          const response = mapErrorToStatusCode(error);
          if (response.code === 500) {
            res.status(response.code).json(response.message);
          } else {
            res.sendStatus(response.code);
          }
        }
    };

    /**
     * Retrieve all ratings associated with a specified learning object
     * @param {Request} req
     * @param {Response} res
     */
    const getLearningObjectRatings = async (req: Request, res: Response) => {
        try {
          const ratings = await interactor.getLearningObjectRatings({
            dataStore,
            learningObjectId: req.params.learningObjectId,
          });
          res.send(200).json(ratings);
        } catch (error) {
          const response = mapErrorToStatusCode(error);
          if (response.code === 500) {
            res.status(response.code).json(response.message);
          } else {
            res.sendStatus(response.code);
          }
        }
    };

    router.get('/ratings/:ratingId', getRating);
    router.get('/learning-objects/:learningObjectId/ratings', getLearningObjectRatings);

    return router;
  }

/**
 * Initializes an express router with endpoints for private
 * rating functions
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

    /**
     * Delete a specifed rating
     * @param {Request} req
     * @param {Response} res
     */
    const deleteRating = async (req: Request, res: Response) => {
        try {
          const ratingId = req.params.ratingId;
          const currentUsername = req['user']['username'];
          await interactor.deleteRating({
            dataStore,
            ratingId,
            currentUsername,
          });
          res.sendStatus(200);
        } catch (error) {
          const response = mapErrorToStatusCode(error);
          if (response.code === 500) {
            res.status(response.code).json(response.message);
          } else {
            res.sendStatus(response.code);
          }
        }
    };

    /**
     * Edit a specified rating
     * @param {Request} req
     * @param {Response} res
     */
    const updateRating = async (req: Request, res: Response) => {
        try {
          const updates = req.body;
          const ratingId = req.params.ratingId;
          const currentUsername = req['user']['username'];
          await interactor.updateRating({
            dataStore,
            ratingId,
            updates,
            currentUsername,
          });
          res.sendStatus(200);
        } catch (error) {
          const response = mapErrorToStatusCode(error);
          if (response.code === 500) {
            res.status(response.code).json(response.message);
          } else {
            res.sendStatus(response.code);
          }
        }
    };

    /**
     * Create a new rating
     * @param {Request} req
     * @param {Response} res
     */
    const createRating = async (req: Request, res: Response) => {
        try {
          const rating = req.body;
          const learningObjectId = req.params.learningObjectId;
          const username = req['user']['username'];
          const email = req['user']['email'];
          const name = req['user']['name'];
          await interactor.createRating({
            dataStore,
            rating,
            learningObjectId,
            username,
            email,
            name,
          });
          res.sendStatus(200);
        } catch (error) {
          const response = mapErrorToStatusCode(error);
          if (response.code === 500) {
            res.status(response.code).json(response.message);
          } else {
            res.sendStatus(response.code);
          }
        }
    };

    router.delete('/learning-objects/:learningObjectId/ratings/:ratingId', deleteRating);
    router.patch('/learning-objects/:learningObjectId/ratings/:ratingId', updateRating);
    router.post('/learning-objects/:learningObjectId/ratings', createRating);
}
