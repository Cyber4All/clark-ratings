import { Request, Response, Router } from 'express';
import * as interactor from './RatingsInteractor';
import { mapErrorToStatusCode } from '../errors';
import { RatingStore } from './RatingStore';

/**
 * Initializes an express router with endpoints for public
 * rating functions
 *
 * @export
 * @param {{
 *   router: Router
 * }} {
 *   router
 * }
 * @returns
 */
export function initializePublic({
    router,
  }: {
    router: Router;
  }) {

    /**
     * Retrieve a rating by a specified ID
     * @param {Request} req
     * @param {Response} res
     */
    const getRating = async (req: Request, res: Response) => {
        try {
          const rating = await interactor.getRating({
            ratingId: req.params.ratingId,
          });
          res.status(200).json(rating);
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
            learningObjectId: req.params.learningObjectId,
          });
          res.status(200).json(ratings);
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
 *   router: Router
 * }} {
 *   router
 * }
 * @returns
 */
export function initializePrivate({
    router,
}: {
    router: Router;
}) {

    /**
     * Delete a specifed rating
     * @param {Request} req
     * @param {Response} res
     */
    const deleteRating = async (req: Request, res: Response) => {
        try {
          const ratingId = req.params.ratingId;
          const user = req['user'];
          await interactor.deleteRating({
            ratingId,
            user,
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
          const user = req['user'];
          await interactor.updateRating({
            ratingId,
            updates,
            user,
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
          const user = req['user'];
          await interactor.createRating({
            rating,
            learningObjectId,
            user,
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
