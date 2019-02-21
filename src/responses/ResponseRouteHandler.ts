import { Request, Response, Router } from 'express';
import * as interactor from './ResponseInteractor';
import { mapErrorToStatusCode } from '../errors';
import { ResponseStore } from './ResponseStore';

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
     * Fetch reponse for given rating
     * @param {Request} req
     * @param {Response} res
     */
    const getResponse = async (req: Request, res: Response) => {
      try {
        const ratingId = req.params.ratingId;
        const response = await interactor.getResponse({
          ratingId,
        });
        res.status(200).json(response);
      } catch (error) {
        const response = mapErrorToStatusCode(error);
        if (response.code === 500) {
          res.status(response.code).json(response.message);
        } else {
          res.sendStatus(response.code);
        }
      }
    };

    router.get('/learning-objects/:learningObjectId/ratings/:ratingId/responses', getResponse);

    return router;
}

/**
 * Initializes an express router with endpoints for private
 * rating functions
 *
 * @export
 * @property { Router } router instance of Express Router
 */
export function initializePrivate({
    router,
}: {
    router: Router;
}) {

    /**
     * Delete a specifed response
     * @param {Request} req
     * @param {Response} res
     */
    const deleteResponse = async (req: Request, res: Response) => {
        try {
          const user = req['user'];
          const responseId = req.params.responseId;
          await interactor.deleteResponse({
            responseId,
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
     * Edit a specified response
     * @param {Request} req
     * @param {Response} res
     */
    const updateResponse = async (req: Request, res: Response) => {
        try {
          const user = req['user'];
          const updates = req.body;
          const responseId = req.params.responseId;
          await interactor.updateResponse({
            responseId,
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
     * Create a new response for a specifed rating
     * @param {Request} req
     * @param {Response} res
     */
    const createResponse = async (req: Request, res: Response) => {
        try {
          const response = req.body;
          const ratingId = req.params.ratingId;
          const user = req['user'];
          await interactor.createResponse({
            ratingId,
            response,
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

    router.delete('/learning-objects/:learningObjectId/ratings/:ratingId/responses/:responseId', deleteResponse);
    router.patch('/learning-objects/:learningObjectId/ratings/:ratingId/responses/:responseId', updateResponse);
    router.post('/learning-objects/:learningObjectId/ratings/:ratingId/responses', createResponse);
}
