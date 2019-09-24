import { Request, Response, Router } from 'express';
import * as interactor from './ResponseInteractor';
import { mapErrorToStatusCode } from '../errors';

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

    router.get('/learning-objects/:CUID/version/:versionID/ratings/:ratingID/responses', getResponse);

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
          const user = req['user'];
          const responseID = req.params.responseId;
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
          const user = req['user'];
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
          const response = req.body;
          const ratingID = req.params.ratingID;
          const user = req['user'];
          await interactor.createResponse({
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

    router.delete('/learning-objects/:CUID/version/:versionID/ratings/:ratingID/responses/:responseId', deleteResponse);
    router.patch('/learning-objects/:CUID/version/:versionID/ratings/:ratingID/responses/:responseId', updateResponse);
    router.post('/learning-objects/:CUID/version/:versionID/ratings/:ratingID/responses', createResponse);
}
