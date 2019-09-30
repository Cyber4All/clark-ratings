import { Request, Response, Router } from 'express';
import * as interactor from '../flags/FlagInteractor';
import { mapErrorToStatusCode } from '../errors';
import { FlagNotifier } from './interfaces/FlagNotifier';
import { SlackGateway } from './gateways/SlackGateway';

export function initializePrivate(router: Router) {

    const getAllFlags = async (req: Request, res: Response) => {
        try {
            const flags = await interactor.getAllFlags({
                user: req.user,
            });
            res.status(200).json(flags);
        } catch (error) {
            const response = mapErrorToStatusCode(error);
            res.status(response.code).json(response.message);
        }
    };

    const getRatingFlags = async (req: Request, res: Response) => {
        try {
            const ratingID = req.params.ratingID;
            const ratings = await interactor.getRatingFlags({
                user: req.user,
                ratingID,
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
                user: req.user,
                flagID: req.params.flagID,
            });
            res.sendStatus(200);
        } catch (error) {
            const response = mapErrorToStatusCode(error);
            res.status(response.code).json(response.message);
        }
    };

    const createFlag = async (req: Request, res: Response) => {
        try {
            const ratingID = req.params.ratingID;
            const CUID = req.params.CUID;
            const version = req.params.version;
            const flag = req.body;
            const flagNotifier: FlagNotifier = new SlackGateway();
            await interactor.flagRating({
                ratingID,
                version,
                CUID,
                user: req.user,
                flag,
                flagNotifier,
            });
            res.sendStatus(204);
        } catch (error) {
            const response = mapErrorToStatusCode(error);
            res.status(response.code).json(response.message);
        }
    };

    router.get('/flags', getAllFlags);
    router.get('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID/flags', getRatingFlags);
    router.delete('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID/flags/:flagID', deleteFlag);
    router.post('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID/flags', createFlag);
}
