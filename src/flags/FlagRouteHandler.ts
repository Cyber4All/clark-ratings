import { Request, Response, Router } from 'express';
import { DataStore } from '../interfaces/interfaces';
import * as interactor from '../flags/FlagInteractor';
import { mapErrorToStatusCode } from '../errors';

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

    const getAllFlags = async (req: Request, res: Response) => {
        try {
            await interactor.getAllFlags(this.dataStore);
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

    const getUserFlags = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            await interactor.getUserFlags({
                dataStore: this.dataStore,
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

    const getLearningObjectFlags = async (req: Request, res: Response) => {
        try {
            const learningObjectId = req.params.learningObjectId;
            await interactor.getLearningObjectFlags({
                dataStore: this.dataStore,
                learningObjectId,
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

    const getRatingFlags = async (req: Request, res: Response) => {
        try {
            const ratingId = req.params.ratingId;
            await interactor.getRatingFlags({
                dataStore: this.dataStore,
                ratingId,
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

    const deleteFlag = async (req: Request, res: Response) => {
        try {
            const flagId = req.params.flagId;
            await interactor.deleteFlag({
                dataStore: this.dataStore,
                flagId,
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

    const createFlag = async (req: Request, res: Response) => {
        // flag a rating
        const ratingId = req.params.ratingId;
        const flag = req.body;
        const currentUsername = req['user']['username'];
        try {
          await interactor.flagRating({
            dataStore: this.dataStore,
            ratingId,
            currentUsername,
            flag,
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

    router.get('/flags', getAllFlags);
    router.get('/users/:username/flags', getUserFlags);
    router.get('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/flags', getLearningObjectFlags);
    router.get('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId/flags', getRatingFlags);
    router.delete('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId/flags/:flagId', deleteFlag);
    router.post('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId/flags', createFlag);
}
