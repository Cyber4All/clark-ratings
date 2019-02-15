import { Request, Response, Router } from 'express';
import * as interactor from './ResponseInteractor';
import { mapErrorToStatusCode } from '../errors';
import { ResponseStore } from './ResponseStore';

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
          const responseId = req.params.responseId;
          await interactor.deleteResponse({
            dataStore: getDataStore(),
            responseId,
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
          const updates = req.body;
          const responseId = req.params.responseId;
          await interactor.updateResponse({
            dataStore: getDataStore(),
            responseId,
            updates,
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
          await interactor.createResponse({
            dataStore: getDataStore(),
            ratingId,
            response,
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

function getDataStore() {
  return ResponseStore.getInstance();
}
