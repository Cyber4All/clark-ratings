import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as http from 'http';
import * as Sentry from '@sentry/node';
import { ExpressRouteDriver, ExpressAuthRouteDriver } from '../drivers';
import { enforceAuthenticatedAccess } from '../../middleware/jwt.config';
import { enforceEmailVerification } from '../../middleware/email-verification';

export class ExpressDriver {
    static app = express();
    static start(
    ) {
      Sentry.init({ dsn: 'https://d38ff66aa9a44baab644145ee2547155@sentry.io/1402458' });
      this.app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
      this.app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
      // configure app to use bodyParser()
      this.app.use(
        bodyParser.urlencoded({
          extended: true,
        }),
      );
      this.app.use(bodyParser.json());

      // Setup route logger
      this.app.use(logger('dev'));

      this.app.use(
        cors({
          origin: true,
          credentials: true,
        }),
      );
      // Set up cookie parser
      this.app.use(cookieParser());

      // Set our public api routes
      this.app.use(
        '/',
        ExpressRouteDriver.buildRouter(),
      );

      // Set Validation Middleware
      this.app.use(enforceAuthenticatedAccess);
      this.app.use((error: any, req: any, res: any, next: any) => {
        if (error.name === 'UnauthorizedError') {
          res.status(401).send('Invalid Access Token');
        }
      });

       // Set Validation Middleware - email verification
      this.app.use(enforceEmailVerification);

      // Set our authenticated api routes
      this.app.use(
        '/',
        ExpressAuthRouteDriver.buildRouter(),
      );

      /**
       * Get port from environment and store in Express.
       */
      const port = process.env.PORT || '3000';
      this.app.set('port', port);

      // Allow Proxy
      this.app.set('trust proxy', true);

      /**
       * Create HTTP server.
       */
      const server = http.createServer(this.app);

      /**
       * Listen on provided port, on all network interfaces.
       */
      server.listen(port, () =>
        console.log(`Ratings Service running on localhost: ${port}`),
      );

      return this.app;
    }
  }
