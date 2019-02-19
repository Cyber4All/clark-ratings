import { Request, Response, Router } from 'express';
import * as interactor from '../flags/FlagInteractor';
import { mapErrorToStatusCode } from '../errors';
import { FlagStore } from './FlagStore';

/**
 * Initializes an express router with endpoints for public Creating, Updating, and Deleting
 * a Learning Object.
 *
 * @export
 * @param {{
 *   fileManager: FileManager;
 *   library: LibraryCommunicator;
 * }} {
 *   fileManager,
 *   library,
 * }
 * @returns
 */
export function initializePrivate({
    router,
}: {
    router: Router;
}) {

    const getAllFlags = async (req: Request, res: Response) => {
        try {
            const flags = await interactor.getAllFlags({
                dataStore: getDataStore(),
            });
            res.status(200).json(flags);
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
            const ratings = await interactor.getRatingFlags({
                dataStore: getDataStore(),
                ratingId,
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

    const deleteFlag = async (req: Request, res: Response) => {
        try {
            await interactor.deleteFlag({
                dataStore: getDataStore(),
                flagId: req.params.flagId,
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
        try {
            const ratingId = req.params.ratingId;
            const flag = req.body;
            const currentUsername = req['user']['username'];
            await interactor.flagRating({
                dataStore: getDataStore(),
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
    router.get('/learning-objects/:learningObjectId/ratings/:ratingId/flags', getRatingFlags);
    router.delete('/learning-objects/:learningObjectId/ratings/:ratingId/flags/:flagId', deleteFlag);
    router.post('/learning-objects/:learningObjectId/ratings/:ratingId/flags', createFlag);
}

function getDataStore() {
    return FlagStore.getInstance();
}
