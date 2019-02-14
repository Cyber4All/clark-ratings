import * as raven from 'raven';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as http from 'http';
import { ExpressRouteDriver, ExpressAuthRouteDriver } from '../drivers';
import { enforceAuthenticatedAccess } from '../../middleware/jwt.config';
import { enforceEmailVerification } from '../../middleware/email-verification';

export class ExpressDriver {
    static app = express();
    static start(
    ) {
      raven.config(process.env.SENTRY_DSN).install();
      this.app.use(raven.requestHandler());
      this.app.use(raven.errorHandler());
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
        console.log(`Learning Object Service running on localhost:${port}`),
      );

      return this.app;
    }
  }
