import { DataStore, Responder } from "../../interfaces/interfaces";
import { Router } from "express";
import { RatingsInteractor } from "../../interactors/RatingsInteractor";

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

  /**
   * Defines the active routes for the API. Routes take an async callback function that contains a request and response object.
   * The callback awaits a particular interactor function that executes the connected business use case.
   *
   * @param router the router being used by the webserver
   */
  private setRoutes(router: Router) {
    // new instance of RatingsInteractor
    const interactor = new RatingsInteractor();

    router
      .route(
        "/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId"
      )
      .delete(async (req, res) => {
        // delete specified rating
        const ratingId = req.params.ratingId;
        const learningObjectName = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const currentUsername = req["user"]["username"];
        try {
          await interactor.deleteRating(
            this.dataStore,
            ratingId,
            learningObjectName,
            learningObjectAuthor,
            currentUsername
          );
          res.sendStatus(200);
        } catch (error) {
          res.send(500).json({message: error.message});
        }
      })
      .patch(async (req, res) => {
        // update specified rating
        const editRating = req.body;
        const ratingId = req.params.ratingId;
        const learningObjectName = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const currentUsername = req["user"]["username"];
        try {
          await interactor.updateRating(
            this.dataStore,
            ratingId,
            learningObjectName,
            learningObjectAuthor,
            editRating,
            currentUsername
          );
          res.sendStatus(200);
        } catch (error) {
          res.send(500).json({message: error.message});
        }
      });

    router
      .route(
        "/learning-objects/:learningObjectAuthor/:learningObjectName/ratings"
      )
      .post(async (req, res) => {
        // create a new rating for the associated learning object
        const rating = req.body;
        const learningObjectName = req.params.learningObjectName;
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const username = req["user"]["username"];
        const email = req["user"]["email"];
        const name = req["user"]["name"];
        try {
          await interactor.createNewRating(
            this.dataStore,
            rating,
            learningObjectName,
            learningObjectAuthor,
            username,
            email,
            name
          );
          res.sendStatus(200);
        } catch (error) {
          res.send(500).json({message: error.message});
        }
      });

    router
      .route(
        "/learning-objects/:learningObjectAuthor/:learningObjectName/ratings/:ratingId/flags"
      )
      .post(async (req, res) => {
        // flag a rating
        const learningObjectAuthor = req.params.learningObjectAuthor;
        const learningObjectName = req.params.learningObjectName;
        const ratingId = req.params.ratingId;
        const flag = req.body;
        const currentUsername = req["user"]["username"];
        try {
          await interactor.flagRating(
            this.dataStore,
            ratingId,
            currentUsername,
            flag
          );
          res.sendStatus(200);
        } catch (error) {
          res.send(500).json({message: error.message});
        }
      });
  }
}
