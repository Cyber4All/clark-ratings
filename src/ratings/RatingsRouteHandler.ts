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
            version: req.params.version,
            username: req.params.username,
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
    router.get('/users/:username/learning-objects/:CUID/version/:version/ratings', getLearningObjectRatings);

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
        const username = req.params.username;
        const ratingID = req.params.ratingID;
        const user = req.user;
        const CUID = req.params.CUID;
        const version = req.params.version;
        await interactor.deleteRating({
          username,
          CUID,
          version,
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
          const username = req.params.username;
          const updates = req.body;
          const ratingID = req.params.ratingID;
          const CUID = req.params.CUID;
          const version = req.params.version;
          const user = req.user;
          await interactor.updateRating({
            username,
            ratingID,
            CUID,
            version,
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
          const username = req.params.username;
          const rating = req.body;
          const CUID = req.params.CUID;
          const version = req.params.version;
          const user = req.user;
          const ratingNotifier: RatingNotifier = new SlackGateway();
          await interactor.createRating({
            username,
            rating,
            CUID,
            version,
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

    router.delete('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID', deleteRating);
    router.patch('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID', updateRating);
    router.post('/users/:username/learning-objects/:CUID/version/:version/ratings', createRating);
}
