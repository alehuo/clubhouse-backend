require("dotenv").config();

import * as express from "express";
import * as helmet from "helmet";
import * as Knex from "knex";
import * as morgan from "morgan";
import AuthController from "./controllers/AuthController";
import CalendarEventController from "./controllers/CalendarEventController";
import LocationController from "./controllers/LocationController";
import MessageController from "./controllers/MessageController";
import NewsPostController from "./controllers/NewsPostController";
import PermissionController from "./controllers/PermissionController";
import StatisticsController from "./controllers/StatisticsController";
import StudentUnionController from "./controllers/StudentUnionController";
import UserController from "./controllers/UserController";
import WatchController from "./controllers/WatchController";
import CalendarEventDao from "./dao/CalendarEventDao";
import LocationDao from "./dao/LocationDao";
import MessageDao from "./dao/MessageDao";
import NewsPostDao from "./dao/NewsPostDao";
import PermissionDao from "./dao/PermissionDao";
import StatisticsDao from "./dao/StatisticsDao";
import StudentUnionDao from "./dao/StudentUnionDao";
import UserDao from "./dao/UserDao";
import WatchDao from "./dao/WatchDao";
import * as Database from "./Database";

// Express instance
const app: express.Application = express();

// Use Helmet
app.use(helmet());

// Knex instance
const knex: Knex = Database.connect();

// API version
const API_VERSION: string = "v1";

// Generates an API url. API version defaults to API_VERSION constant.
const apiUrl = (path: string, apiVersion: string = API_VERSION) =>
  "/api/" + apiVersion + "/" + path;

const apiHeader = (path: string, apiVersion: string = API_VERSION) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.setHeader("X-Route-API-Version", apiVersion);
  next();
};

// JSON parser
app.use(express.json());

// Morgan
app.use(morgan("tiny"));

// Compression
// app.use(compression());

// API version header
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("X-Latest-API-Version", API_VERSION);
    next();
  }
);

// Users route
app.use(
  apiUrl("users"),
  apiHeader("users"),
  new UserController(
    new UserDao(knex),
    new CalendarEventDao(knex),
    new StudentUnionDao(knex),
    new MessageDao(knex),
    new NewsPostDao(knex),
    new WatchDao(knex)
  ).routes()
);

// Auth route
app.use(apiUrl("authenticate"), new AuthController(new UserDao(knex)).routes());

// Student unions route
app.use(
  apiUrl("studentunion"),
  apiHeader("studentunion"),
  new StudentUnionController(new StudentUnionDao(knex)).routes()
);

// Calendar route
app.use(
  apiUrl("calendar"),
  apiHeader("calendar"),
  new CalendarEventController(new CalendarEventDao(knex)).routes()
);

// Location route
app.use(
  apiUrl("location"),
  apiHeader("location"),
  new LocationController(new LocationDao(knex)).routes()
);

// Permission route
app.use(
  apiUrl("permission"),
  apiHeader("permission"),
  new PermissionController(new PermissionDao(knex)).routes()
);

// Watch route
app.use(
  apiUrl("watch"),
  apiHeader("watch"),
  new WatchController(new WatchDao(knex)).routes()
);

// Message route
app.use(
  apiUrl("message"),
  apiHeader("message"),
  new MessageController(new MessageDao(knex)).routes()
);

// Newspost route
app.use(
  apiUrl("newspost"),
  apiHeader("newspost"),
  new NewsPostController(new NewsPostDao(knex)).routes()
);

// Statistics route
app.use(
  apiUrl("statistics"),
  apiHeader("statistics"),
  new StatisticsController(new StatisticsDao(knex), new UserDao(knex)).routes()
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
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
);

// Listen
app.listen(process.env.PORT, () => {
  console.log("Server running at ::%d", process.env.PORT);
});

export default app;
