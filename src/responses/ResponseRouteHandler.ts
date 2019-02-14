import { Request, Response, Router } from 'express';
import { DataStore } from '../interfaces/interfaces';
import * as interactor from './ResponseInteractor';
import { mapErrorToStatusCode } from '../errors';

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
     * Delete a specifed response
     * @param {Request} req
     * @param {Response} res
     */
    const deleteResponse = async (req: Request, res: Response) => {
        try {
          const ratingId = req.params.ratingId;
          const username = req['user']['username'];
          await interactor.deleteResponse({
            dataStore,
            ratingId,
            username,
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
          const ratingId = req.params.ratingId;
          const username = req['user']['username'];
          await interactor.updateResponse({
            dataStore,
            ratingId,
            updates,
            username,
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
          const username = req['user']['username'];
          const email = req['user']['email'];
          const name = req['user']['name'];
          await interactor.createResponse({
            dataStore,
            response,
            ratingId,
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

    router.delete('/learning-objects/:learningObjectId/ratings/:ratingId/responses/:responseId', deleteResponse);
    router.patch('/learning-objects/:learningObjectId/ratings/:ratingId/responses/:responseId', updateResponse);
    router.post('/learning-objects/:learningObjectId/ratings/:ratingId/responses', createResponse);
}
