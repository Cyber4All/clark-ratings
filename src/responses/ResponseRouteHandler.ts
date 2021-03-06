import { Request, Response, Router } from 'express';
import * as interactor from './ResponseInteractor';
import { mapErrorToStatusCode } from '../errors';

export function initializePublic(router: Router) {

    /**
     * Fetch reponse for given rating
     * @param {Request} req
     * @param {Response} res
     */
    const getResponse = async (req: Request, res: Response) => {
      try {
        const ratingID = req.params.ratingID;
        const response = await interactor.getResponses({
          ratingIDs: [ratingID],
        });
        res.status(200).json(response);
      } catch (error) {
        const response = mapErrorToStatusCode(error);
        res.status(response.code).json(response.message);
      }
    };

    router.get('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID/responses', getResponse);

    return router;
}

/**
 * Initializes an express router with endpoints for private
 * rating functions
 *
 * @export
 * @property { Router } router instance of Express Router
 */
export function initializePrivate(router: Router) {
    /**
     * Delete a specifed response
     * @param {Request} req
     * @param {Response} res
     */
    const deleteResponse = async (req: Request, res: Response) => {
        try {
          const user = req.user;
          const responseID = req.params.responseID;
          await interactor.deleteResponse({
            responseID,
            user,
          });
          res.sendStatus(200);
        } catch (error) {
          const response = mapErrorToStatusCode(error);
          res.status(response.code).json(response.message);
        }
    };

    /**
     * Edit a specified response
     * @param {Request} req
     * @param {Response} res
     */
    const updateResponse = async (req: Request, res: Response) => {
        try {
          const user = req.user;
          const updates = req.body;
          const responseID = req.params.responseID;
          await interactor.updateResponse({
            responseID,
            updates,
            user,
          });
          res.sendStatus(200);
        } catch (error) {
          const response = mapErrorToStatusCode(error);
          res.status(response.code).json(response.message);
        }
    };

    /**
     * Create a new response for a specifed rating
     * @param {Request} req
     * @param {Response} res
     */
    const createResponse = async (req: Request, res: Response) => {
        try {
          const username = req.params.username;
          const response = req.body;
          const ratingID = req.params.ratingID;
          const user = req.user;
          await interactor.createResponse({
            username,
            ratingID,
            response,
            user,
          });
          res.sendStatus(200);
        } catch (error) {
          const response = mapErrorToStatusCode(error);
          res.status(response.code).json(response.message);
        }
    };

    router.delete('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID/responses/:responseID', deleteResponse);
    router.patch('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID/responses/:responseID', updateResponse);
    router.post('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID/responses', createResponse);
}
