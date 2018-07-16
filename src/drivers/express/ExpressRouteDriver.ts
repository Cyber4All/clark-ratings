import { ExpressResponder } from '../express/ExpressResponder';
import { DataStore, Responder } from '../../interfaces/interfaces';
import { Router } from 'express'; 
import { RatingsInteractor } from '../../interactors/RatingsInteractor';

/**
 * A factory for producing a router for the express app.
 *
 * @author Sean Donnelly
 */
export class ExpressRouteDriver {
  /**
   * Produces a configured express router
   *
   * @param dataStore the data store that the routes should utilize
   */
  public static buildRouter(dataStore: DataStore) {
    let e = new ExpressRouteDriver(dataStore,);
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

    router.get('/', (req, res) => {
      // default route
        res.send('Welcome to the CLARK Rating Service');
    });

    router.route('/ratings/:ratingId')
    .get(async (req, res) => {
       // return the specified rating 
       interactor.getRating(this.dataStore, this.getResponder(res), req.params.ratingId);
    })
    .patch(async (req, res) => {
      // update specified rating
      // TODO check to see if the cookie's user is the owner of the rating before allowing modification
      interactor.updateRating(this.dataStore, this.getResponder(res), req.params.ratingId, req.body.rating); 
    })
    .delete(async (req, res) => {
      // delete specified rating
      // TODO check to see if the cookie's user is the owner of the rating before allowing deletion
      
      interactor.deleteRating(this.dataStore, this.getResponder(res), req.params.ratingId);
    })

    router.route('/users/:username/learning-objects/:learningObjectName/ratings')
    .get(async (req, res) => {
      // return all ratings from the associated learning object
    })
    .post(async (req, res) => {
      // create a new rating for the associated learning object
    });

    router.route('/users/:username/ratings')
    .get(async (req, res) => {
      // get all of a user's ratings (all ratings made by a user)
      // FIXME is this functionality necessary?
    })
  }
}
