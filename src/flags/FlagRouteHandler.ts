import { Request, Response, Router } from 'express';
import { DataStore } from '../interfaces/DataStore';

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
            res.send(500).json({message: error.message});
        }
    };

    const getUserFlags = async (req: Request, res: Response) => {
        try {
            const username  = req.params.username;
            await interactor.getUserFlags(this.dataStore, username);
            res.sendStatus(200);
        } catch (error) {
            res.send(500).json({message: error.message});
        }
    };

    const getLearningObjectFlags = async (req: Request, res: Response) => {
        try {
            const learningObjectName   = req.params.learningObjectName;
            const learningObjectAuthor = req.params.learningObjectAuthor;
            await interactor.getLearningObjectFlags(this.dataStore, learningObjectName, learningObjectAuthor);
            res.sendStatus(200);
        } catch (error) {
            res.send(500).json({message: error.message});
        }
    };

    const getRatingFlags = async (req: Request, res: Response) => {
        try {
            const ratingId             = req.params.ratingId;
            const learningObjectName   = req.params.learningObjectName;
            const learningObjectAuthor = req.params.learningObjectAuthor;
            await interactor.getRatingFlags(this.dataStore, learningObjectName, learningObjectAuthor, ratingId);
            res.sendStatus(200);
        } catch (error) {
            res.send(500).json({message: error.message});
        }
    };

    const deleteFlag = async (req: Request, res: Response) => {
        try {
            const ratingId             = req.params.ratingId;
            const learningObjectName   = req.params.learningObjectName;
            const learningObjectAuthor = req.params.learningObjectAuthor;
            const flagId               = req.params.flagId;
            await interactor.deleteFlag(this.dataStore, ratingId, learningObjectName, learningObjectAuthor, flagId);
            res.sendStatus(200);
        } catch (error) {
            res.send(500).json({message: error.message});
        }
    };

    const createFlag = async (req: Request, res: Response) => {
        // flag a rating
        const ratingId = req.params.ratingId;
        const flag = req.body;
        const currentUsername = req['user']['username'];
        try {
          await flagRating(
            this.dataStore,
            ratingId,
            currentUsername,
            flag,
          );
          res.sendStatus(200);
        } catch (error) {
          res.send(500).json({message: error.message});
        }
    };

    router.get('/flags', getAllFlags);
    router.get('/users/:username/flags', getUserFlags);
    router.get('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/flags', getLearningObjectFlags);
    router.get('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId/flags', getRatingFlags);
    router.delete('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId/flags/:flagId', deleteFlag);
    router.post('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId/flags', createFlag);
}
