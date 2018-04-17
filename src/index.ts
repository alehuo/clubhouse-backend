require("dotenv").config();

import * as express from "express";
import * as Knex from "knex";
import * as morgan from "morgan";
import * as compression from "compression";
// const apicache = require("apicache");
import UserController from "./controllers/UserController";
import * as Database from "./Database";
import UserDao from "./dao/UserDao";
import AuthController from "./controllers/AuthController";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import StudentUnionDao from "./dao/StudentUnionDao";
import StudentUnionController from "./controllers/StudentUnionController";
import CalendarEventController from "./controllers/CalendarEventController";
import CalendarEventDao from "./dao/CalendarEventDao";
import LocationDao from "./dao/LocationDao";
import LocationController from "./controllers/LocationController";
import PermissionDao from "./dao/PermissionDao";
import PermissionController from "./controllers/PermissionController";
import WatchDao from "./dao/WatchDao";
import WatchController from "./controllers/WatchController";
import MessageController from "./controllers/MessageController";
import MessageDao from "./dao/MessageDao";

// Express instance
const app: express.Application = express();

// Knex instance
const knex: Knex = Database.connect();

// API version
const API_VERSION: string = "v1";

// Generates an API url. API version defaults to API_VERSION constant.
const apiUrl = (path: string, apiVersion: string = API_VERSION) =>
  "/api/" + apiVersion + "/" + path;

// JSON parser
app.use(express.json());

// Morgan
app.use(morgan("tiny"));

// Compression
app.use(compression());

// API cache
/*const cache = apicache.middleware;
app.use(cache("5 minutes"));*/

// Users route
app.use(apiUrl("users"), new UserController(new UserDao(knex)).routes());

// Auth route
app.use(apiUrl("authenticate"), new AuthController(new UserDao(knex)).routes());

// Student unions route
app.use(
  apiUrl("studentunion"),
  new StudentUnionController(new StudentUnionDao(knex)).routes()
);

// Calendar route
app.use(
  apiUrl("calendar"),
  new CalendarEventController(new CalendarEventDao(knex)).routes()
);

// Location route
app.use(
  apiUrl("location"),
  new LocationController(new LocationDao(knex)).routes()
);

// Permission route
app.use(
  apiUrl("permission"),
  new PermissionController(new PermissionDao(knex)).routes()
);

// Watch route
app.use(apiUrl("watch"), new WatchController(new WatchDao(knex)).routes());

// Message route
app.use(
  apiUrl("message"),
  new MessageController(new MessageDao(knex)).routes()
);

app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        colorize: true
      }),
      new winston.transports.File({
        json: true,
        filename: "app.log",
        maxsize: 100000
      })
    ],
    msg:
      "HTTP {{req.method}} {{res.statusCode}} {{res.responseTime}}ms {{req.url}}",
    expressFormat: true,
    colorize: true,
    ignoreRoute: (req, res) => false
  })
);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.status(404).json({ error: "Invalid API route" });
  }
);

app.use(
  (
    err,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    return res.status(500).json({ error: "Internal server error" });
  }
);

// Listen
app.listen(process.env.SERVER_PORT, () => {
  console.log("Server running at ::%d", process.env.SERVER_PORT);
});
