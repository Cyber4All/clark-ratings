import { Router } from 'express';
import * as express from 'express';
import { 
    ExpressRouteDriver,
    ExpressAuthRouteDriver
} from './drivers/drivers';
import { enforceTokenAccess } from './middleware/jwt.config';
import { isAuthor } from './middleware/author-access';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { MongoDriver } from './drivers/MongoDriver';
import * as bodyParser from 'body-parser';
import * as http from 'http';

let app = express();

let dataStore = new MongoDriver();
let routeDriver: Router = ExpressRouteDriver.buildRouter(dataStore);

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// app.use(enforceTokenAccess);
// app.use(function(error, req, res, next) {
//   if (error.name === 'UnauthorizedError') {
//     res.status(401).send('Invalid Access Token');
//   }
// });

// Set our public api routes
app.use('/', routeDriver);

// Set Validation Middleware
app.use(enforceTokenAccess);
app.use((error: any, req: any, res: any, next: any) => {
  if (error.name === 'UnauthorizedError') {
    res.status(401).send('Invalid Access Token');
  }
});
// Set user as a global variable for authorization
app.use(isAuthor);

// Set our authenticated api routes
app.use('/', 
    ExpressAuthRouteDriver.buildRouter(dataStore)
);

app.set('trust proxy', true);

const port = process.env.PORT || '3000';
let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Clark Rating Service running on port ${port}!`));
