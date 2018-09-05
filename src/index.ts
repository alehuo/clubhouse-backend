require("dotenv").config();

import * as express from "express";
import * as fs from "fs";
import * as helmet from "helmet";
import * as Knex from "knex";
import * as morgan from "morgan";
import * as path from "path";
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
import { apiHeader, apiUrl } from "./utils/ApiUtils";

// Express instance
const app: express.Application = express();

// Use Helmet
app.use(helmet());

// Knex instance
const knex: Knex = Database.connect();

// API version
const API_VERSION: string = "v1";

// JSON parser
app.use(express.json());

// Morgan
app.use(
  morgan("dev", {
    skip(req: express.Request, res: express.Response): boolean {
      return res.statusCode < 400;
    }
  })
);
app.use(
  morgan("common", {
    stream: fs.createWriteStream(path.join(__dirname, "..", "access.log"), {
      flags: "a"
    }),
  })
);

// API version header
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("X-Latest-API-Version", API_VERSION);
    next();
  }
);

// Users route
app.use(
  apiUrl("users", API_VERSION),
  apiHeader("users", API_VERSION),
  new UserController(
    new UserDao(knex),
    new CalendarEventDao(knex),
    new MessageDao(knex),
    new NewsPostDao(knex),
    new WatchDao(knex)
  ).routes()
);

// Auth route
app.use(
  apiUrl("authenticate", API_VERSION),
  new AuthController(new UserDao(knex)).routes()
);

// Student unions route
app.use(
  apiUrl("studentunion", API_VERSION),
  apiHeader("studentunion", API_VERSION),
  new StudentUnionController(new StudentUnionDao(knex)).routes()
);

// Calendar route
app.use(
  apiUrl("calendar", API_VERSION),
  apiHeader("calendar", API_VERSION),
  new CalendarEventController(new CalendarEventDao(knex)).routes()
);

// Location route
app.use(
  apiUrl("location", API_VERSION),
  apiHeader("location", API_VERSION),
  new LocationController(new LocationDao(knex)).routes()
);

// Permission route
app.use(
  apiUrl("permission", API_VERSION),
  apiHeader("permission", API_VERSION),
  new PermissionController(new PermissionDao(knex)).routes()
);

// Watch route
app.use(
  apiUrl("watch", API_VERSION),
  apiHeader("watch", API_VERSION),
  new WatchController(new WatchDao(knex)).routes()
);

// Message route
app.use(
  apiUrl("message", API_VERSION),
  apiHeader("message", API_VERSION),
  new MessageController(new MessageDao(knex)).routes()
);

// Newspost route
app.use(
  apiUrl("newspost", API_VERSION),
  apiHeader("newspost", API_VERSION),
  new NewsPostController(new NewsPostDao(knex)).routes()
);

// Statistics route
app.use(
  apiUrl("statistics", API_VERSION),
  apiHeader("statistics", API_VERSION),
  new StatisticsController(new StatisticsDao(knex), new UserDao(knex)).routes()
);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.status(404).json({ error: "Invalid API route" });
  }
);

app.use(
  (
    err: any,
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
