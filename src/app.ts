
// import { enforceTokenAccess } from './middleware/jwt.config';
import { Router } from 'express';
import * as express from 'express';
import { ExpressRouteDriver } from './drivers/express/ExpressRouteDriver';
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

app.use('/', routeDriver);

app.set('trust proxy', true);

const port = process.env.PORT || '3000';
let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Clark Rating Service running on port ${port}!`));
