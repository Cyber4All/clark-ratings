import { ExpressResponder } from './ExpressResponder';
import { DataStore, Responder } from '../../interfaces/interfaces';
import { Router } from 'express'; 
import { AdminRatingsInteractor } from '../../interactors/AdminRatingsInteractor';

/**
 * A factory for producing a router for the express app.
 *
 * @author Sean Donnelly
 */
export class ExpressAdminRouteDriver {
  /**
   * Produces a configured express router
   *
   * @param dataStore the data store that the routes should utilize
   */
  public static buildRouter(dataStore: DataStore) {
    let e = new ExpressAdminRouteDriver(dataStore);
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
    const interactor = new AdminRatingsInteractor();

    // Delete rating - admin permission
    router.route('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId')
      .delete(async (req, res) => {
        const responder            = this.getResponder(res);
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const learningObjectName   = req.params.learningObjectName;
        const ratingId             = req.params.ratingId;
        try {
            await interactor.deleteRating(this.dataStore, learningObjectAuthor, learningObjectName, ratingId);
            responder.sendOperationSuccess();
        } catch (error) {
            responder.sendOperationError(error);
        }
      });

    // Get all flags
    router.route('/flags')
      .get(async (req, res) => {
        const responder = this.getResponder(res);
        try {
            await interactor.getAllFlags(this.dataStore);
            responder.sendOperationSuccess();
        } catch (error) {
            responder.sendOperationError(error);
        }
      });

    // Get all flags for a specific user
    router.route('/users/:username/flags')
      .get(async (req, res) => {
        const responder = this.getResponder(res);
        const username  = req.params.username;
        try {
            await interactor.getUserFlags(this.dataStore, username);
            responder.sendOperationSuccess();
        } catch (error) {
            responder.sendOperationError(error);
        }
      });
    
    // Get all flags for a specific learning object
    router.route('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/flags')
      .get(async (req, res) => {
        // delete specified rating
        const responder            = this.getResponder(res);
        const learningObjectName   = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor 
        try {
            await interactor.getLearningObjectFlags(this.dataStore, learningObjectName, learningObjectAuthor);
            responder.sendOperationSuccess();
        } catch (error) {
            responder.sendOperationError(error);
        }
      });
    
    // Get all flags for a specific rating
    router.route('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId/flags')
      .get(async (req, res) => {
        // delete specified rating
        const responder            = this.getResponder(res);
        const ratingId             = req.params.ratingId;
        const learningObjectName   = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor 
        try {
            await interactor.getRatingFlags(this.dataStore, learningObjectName, learningObjectAuthor, ratingId);
            responder.sendOperationSuccess();
        } catch (error) {
            responder.sendOperationError(error);
        }
      });

    // Delete a flag
    router.route('/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId/flags/:flagId')
      .delete(async (req, res) => {
        // delete specified rating
        const responder            = this.getResponder(res);
        const ratingId             = req.params.ratingId;
        const learningObjectName   = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const flagId               = req.params.flagId;
        try {
            await interactor.deleteFlag(this.dataStore, ratingId, learningObjectName, learningObjectAuthor, flagId);
            responder.sendOperationSuccess();
        } catch (error) {
            responder.sendOperationError(error);
        }
      });
  }
}