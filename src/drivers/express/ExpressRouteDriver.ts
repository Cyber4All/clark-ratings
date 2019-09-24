import { Router } from 'express';
import * as RatingsRouteHandler from '../../ratings/RatingsRouteHandler';
import * as ResponseRouteHandler from '../../responses/ResponseRouteHandler';

/**
 * A factory for producing a router for the express app.
 *
 * @author Sean Donnelly
 */

// tslint:disable-next-line:no-require-imports
const version = require('../../../package.json').version;
export class ExpressRouteDriver {
  /**
   * Produces a configured express router
   *
   * @param dataStore the data store that the routes should utilize
   */
  public static buildRouter() {
    let e = new ExpressRouteDriver();
    let router: Router = Router();
    e.setRoutes(router);
    return router;
  }

  private constructor() {}

  /**
   * Defines the active routes for the API. Routes take an async callback function that contains a request and response object.
   * The callback awaits a particular interactor function that executes the connected business use case.
   *
   * @param router the router being used by the webserver
   */
  private setRoutes(router: Router) {

    router.get('/', (req, res) => {
      // default route
      res.json({
        version,
        message: `Welcome to the Ratings API v${version}`,
      });
    });

    RatingsRouteHandler.initializePublic(router);

    ResponseRouteHandler.initializePublic(router);
  }
}
