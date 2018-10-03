import { Router } from 'express';
import * as express from 'express';
import { 
    ExpressRouteDriver,
    ExpressAuthRouteDriver,
    ExpressAdminRouteDriver
} from './drivers/drivers';
import * logger from 'morgan';
import { enforceTokenAccess } from './middleware/jwt.config';
import { enforceAdminAccess } from './middleware/admin-access';
import { enforceEmailVerification } from './middleware/email-verification';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { MongoDriver } from './drivers/MongoDriver';
import * as bodyParser from 'body-parser';
import * as http from 'http';

let app = express();

let dburi;
switch (process.env.NODE_ENV) {
  case 'development':
    dburi = process.env.CLARK_DB_URI_DEV.replace(
      /<DB_PASSWORD>/g,
      process.env.CLARK_DB_PWD
    )
      .replace(/<DB_PORT>/g, process.env.CLARK_DB_PORT)
      .replace(/<DB_NAME>/g, process.env.CLARK_DB_NAME);
    break;
  case 'production':
    dburi = process.env.CLARK_DB_URI.replace(
      /<DB_PASSWORD>/g,
      process.env.CLARK_DB_PWD
    )
      .replace(/<DB_PORT>/g, process.env.CLARK_DB_PORT)
      .replace(/<DB_NAME>/g, process.env.CLARK_DB_NAME);
    break;
  case 'test':
    dburi = process.env.CLARK_DB_URI_TEST;
    break;
  default:
    break;
}

let dataStore = new MongoDriver(dburi);
let routeDriver: Router = ExpressRouteDriver.buildRouter(dataStore);

// Setup route logger
app.use(logger('dev'));

    app.use(
      cors({
        origin: true,
        credentials: true,
      }),
    );

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Set our public api routes
app.use('/', routeDriver);

// Set Validation Middleware - auth
app.use(enforceTokenAccess);
app.use((error: any, req: any, res: any, next: any) => {
  if (error.name === 'UnauthorizedError') {
    res.status(401).send('Invalid Access Token');
  }
});

// Set Validation Middleware - email verification
app.use(enforceEmailVerification);

// Set our authenticated api routes
app.use('/', 
    ExpressAuthRouteDriver.buildRouter(dataStore)
);

// Set Admin Middleware
app.use(enforceAdminAccess);

// Set our admin api routes
app.use('/', 
    ExpressAdminRouteDriver.buildRouter(dataStore)
);

app.set('trust proxy', true);

const port = process.env.PORT || '3000';
let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Clark Rating Service running on port ${port}!`));
