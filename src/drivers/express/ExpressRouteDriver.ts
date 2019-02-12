import { Router } from 'express';
import * as RatingsRouteHandler from '../../ratings/RatingsRouteHandler';
import { DataStore } from '../../interfaces/interfaces';

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
    let e = new ExpressRouteDriver(dataStore);
    let router: Router = Router();
    e.setRoutes(router);
    return router;
  }

  private constructor(private dataStore: DataStore) {}

  /**
   * Defines the active routes for the API. Routes take an async callback function that contains a request and response object.
   * The callback awaits a particular interactor function that executes the connected business use case.
   *
   * @param router the router being used by the webserver
   */
  private setRoutes(router: Router) {

    router.get('/', (req, res) => {
      // default route
      res.send('Welcome to the CLARK Rating Service');
    });

    RatingsRouteHandler.initializePublic({
      dataStore: this.dataStore,
      router,
    });
  }
}
