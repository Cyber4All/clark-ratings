import { Request, Response, Router } from 'express';
import * as interactor from './interactors/RatingsInteractor';
import { mapErrorToStatusCode } from '../errors';
import { RatingNotifier } from './interfaces/RatingNotifier';
import { SlackGateway } from './gateways/SlackGateway';


export function initializePublic(router: Router) {

    /**
     * Retrieve a rating by a specified ID
     * @param {Request} req
     * @param {Response} res
     */
    const getRating = async (req: Request, res: Response) => {
      try {
        const rating = await interactor.getRating({
          ratingID: req.params.ratingID,
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
     * Retrieve all ratings associated with a specified Learning Object
     * @param {Request} req
     * @param {Response} res
     */
    const getLearningObjectRatings = async (req: Request, res: Response) => {
        try {
          const ratings = await interactor.getLearningObjectRatings({
            CUID: req.params.CUID,
            versionID: req.params.versionID,
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

    router.get('/ratings/:ratingID', getRating);
    router.get('/learning-objects/:CUID/version/:versionID/ratings', getLearningObjectRatings);

    return router;
  }

export function initializePrivate(router: Router) {

    /**
     * Delete a specifed rating
     * @param {Request} req
     * @param {Response} res
     */
    const deleteRating = async (req: Request, res: Response) => {
        try {
          const ratingID = req.params.ratingID;
          const user = req['user'];
          const CUID = req.params.CUID;
          const versionID = req.params.versionID;
          await interactor.deleteRating({
            CUID,
            versionID,
            ratingID,
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
          const ratingID = req.params.ratingID;
          const CUID = req.params.CUID;
          const versionID = req.params.versionID;
          const user = req['user'];
          await interactor.updateRating({
            ratingID,
            CUID,
            versionID,
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
          const CUID = req.params.CUID;
          const versionID = req.params.versionID;
          const user = req['user'];
          const ratingNotifier: RatingNotifier = new SlackGateway();
          await interactor.createRating({
            rating,
            CUID,
            versionID,
            user,
            ratingNotifier,
          });
          res.sendStatus(204);
        } catch (error) {
          const response = mapErrorToStatusCode(error);
          if (response.code === 500) {
            res.status(response.code).json(response.message);
          } else {
            res.sendStatus(response.code);
          }
        }
    };

    router.delete('/learning-objects/:CUID/version/:versionID/ratings/:ratingID', deleteRating);
    router.patch('/learning-objects/:CUID/version/:versionID/ratings/:ratingID', updateRating);
    router.post('/learning-objects/:CUID/version/:versionID/ratings', createRating);
}
