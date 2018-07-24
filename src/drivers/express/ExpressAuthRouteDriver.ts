import { ExpressResponder } from './ExpressResponder';
import { DataStore, Responder } from '../../interfaces/interfaces';
import { Router } from 'express'; 
import { RatingsInteractor } from '../../interactors/RatingsInteractor';

/**
 * A factory for producing a router for the express app.
 *
 * @author Sean Donnelly
 */
export class ExpressAuthRouteDriver {
  /**
   * Produces a configured express router
   *
   * @param dataStore the data store that the routes should utilize
   */
  public static buildRouter(dataStore: DataStore) {
    let e = new ExpressAuthRouteDriver(dataStore);
    let router: Router = Router();
    e.setRoutes(router);
    return router;
  }

  private constructor(private dataStore: DataStore) {}

  private getResponder(res): Responder {
    return new ExpressResponder(res);
  }

  /**
   * Defines the active routes for the API. Routes take an async callback function that contains a request and response object.
   * The callback awaits a particular interactor function that executes the connected business use case.
   *
   * @param router the router being used by the webserver
   */
  private setRoutes(router: Router) {
    // new instance of RatingsInteractor
    const interactor = new RatingsInteractor();

    router.route('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId')
      .delete(async (req, res) => {
        // delete specified rating
        const responder            = this.getResponder(res);
        const ratingId             = req.params.ratingId;
        const learningObjectName   = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor 
        const currentUser          = req['user'];
        try {
            await interactor.deleteRating(this.dataStore, ratingId, learningObjectName, learningObjectAuthor, currentUser);
            responder.sendOperationSuccess();
        } catch (error) {
            responder.sendOperationError(error);
        }
      })
      .patch(async (req, res) => {
        // update specified rating
        const responder            = this.getResponder(res);
        const editRating           = req.body;
        const ratingId             = req.params.ratingId;
        const learningObjectName   = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const currentUser          = req['user'];
        try {
            await interactor.updateRating(this.dataStore, ratingId, learningObjectName, editRating, currentUser); 
            responder.sendOperationSuccess();
        } catch (error) {
            responder.sendOperationError(error);
        }
      });
      
    router.route('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings')
      .post(async (req, res) => {
        // create a new rating for the associated learning object
        const responder            = this.getResponder(res);
        const rating               = req.body;
        const learningObjectName   = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const username             = req['user'].username;
        const email                = req['user'].email;
        const name                 = req['user'].name
        try {
          interactor.createNewRating(this.dataStore, rating, learningObjectName, learningObjectAuthor, username, email, name);
          responder.sendOperationSuccess();
        } catch (error) {
          responder.sendOperationError(error);
        }
      });

    router.route('learning-objects/:learningObjectAuthor/:LearningObjectName/ratings/:ratingId/flag')
      .post(async (req, res) => {
        // flag a rating
        const responder            = this.getResponder(res);
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const learningObjectName   = req.params.learningObjectName;
        const ratingId             = req.params.ratingId;
        const flag                 = req.body;
        const currentUser          = req['user'];
        try {
          interactor.flagRating(this.dataStore, learningObjectAuthor, learningObjectName, ratingId, currentUser, flag);
          responder.sendOperationSuccess();
        } catch (error) {
          responder.sendOperationError(error);
        }
      });
  }
}
