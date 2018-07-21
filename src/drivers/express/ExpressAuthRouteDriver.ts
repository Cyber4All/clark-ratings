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

    router.route('/ratings/:ratingId')
      .patch(async (req, res) => {
        // update specified rating
        const responder   = this.getResponder(res);
        const editRating  = req.body;
        const ratingId    = req.params.ratingId;
        const currentUser = res.locals.user;
        try {
            interactor.updateRating(this.dataStore, ratingId, editRating, currentUser); 
            responder.sendOperationSuccess();
        } catch (error) {
            responder.sendOperationError(error);
        }
      });
      
    router.route('/users/:username/learning-objects/:learningObjectName/ratings')
    .post(async (req, res) => {
      // create a new rating for the associated learning object
      const responder          = this.getResponder(res);
      const rating             = req.body;
      const learningObjectName = req.params.learningObjectName;
      const username           = req.params.username;
      try {
        interactor.createNewRating(this.dataStore, rating, learningObjectName, username);
        responder.sendOperationSuccess();
      } catch (error) {
        responder.sendOperationError(error);
      }
    })
    .delete(async (req, res) => {
      // delete specified rating
      const responder    = this.getResponder(res);
      const ratingId     = req.params.ratingId;
      const learningObjectName = req.params.learningObjectName;
      const currentUser  = res.locals.user;
      try {
          interactor.deleteRating(this.dataStore, ratingId, learningObjectName, currentUser);
          responder.sendOperationSuccess();
      } catch (error) {
          responder.sendOperationError(error);
      }
    })
  }
}
