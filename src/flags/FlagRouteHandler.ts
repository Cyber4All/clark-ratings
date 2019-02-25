import { Request, Response, Router } from 'express';
import * as interactor from '../flags/FlagInteractor';
import { mapErrorToStatusCode } from '../errors';

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
                user: req['user'],
            });
            res.status(200).json(flags);
        } catch (error) {
            const response = mapErrorToStatusCode(error);
            res.status(response.code).json(response.message);
        }
    };

    const getRatingFlags = async (req: Request, res: Response) => {
        try {
            const ratingId = req.params.ratingId;
            const ratings = await interactor.getRatingFlags({
                user: req['user'],
                ratingId,
            });
            res.status(200).json(ratings);
        } catch (error) {
            const response = mapErrorToStatusCode(error);
            res.status(response.code).json(response.message);
        }
    };

    const deleteFlag = async (req: Request, res: Response) => {
        try {
            await interactor.deleteFlag({
                user: req['user'],
                flagId: req.params.flagId,
            });
            res.sendStatus(200);
        } catch (error) {
            const response = mapErrorToStatusCode(error);
            res.status(response.code).json(response.message);
        }
    };

    const createFlag = async (req: Request, res: Response) => {
        try {
            const ratingId = req.params.ratingId;
            const flag = req.body;
            await interactor.flagRating({
                ratingId,
                user: req['user'],
                flag,
            });
            res.sendStatus(200);
        } catch (error) {
            const response = mapErrorToStatusCode(error);
            res.status(response.code).json(response.message);
        }
    };

    router.get('/flags', getAllFlags);
    router.get('/learning-objects/:learningObjectId/ratings/:ratingId/flags', getRatingFlags);
    router.delete('/learning-objects/:learningObjectId/ratings/:ratingId/flags/:flagId', deleteFlag);
    router.post('/learning-objects/:learningObjectId/ratings/:ratingId/flags', createFlag);
}
