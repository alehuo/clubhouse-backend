import dotenv from "dotenv";
dotenv.config();

import moment from "moment";
import "moment/locale/fi";
moment.locale("fi");

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import path from "path";
import AuthController from "./controllers/AuthController";
import CalendarEventController from "./controllers/CalendarEventController";
import KeyTypeController from "./controllers/KeyTypeController";
import LocationController from "./controllers/LocationController";
import MessageController from "./controllers/MessageController";
import NewsPostController from "./controllers/NewsPostController";
import PermissionController from "./controllers/PermissionController";
import RuleController from "./controllers/RuleController";
import SessionController from "./controllers/SessionController";
import StatisticsController from "./controllers/StatisticsController";
import StudentUnionController from "./controllers/StudentUnionController";
import UserController from "./controllers/UserController";
import CalendarEventDao from "./dao/CalendarEventDao";
import KeyDao from "./dao/KeyDao";
import KeyTypeDao from "./dao/KeyTypeDao";
import LocationDao from "./dao/LocationDao";
import MessageDao from "./dao/MessageDao";
import NewsPostDao from "./dao/NewsPostDao";
import RuleDao from "./dao/RuleDao";
import SessionDao from "./dao/SessionDao";
import StatisticsDao from "./dao/StatisticsDao";
import StudentUnionDao from "./dao/StudentUnionDao";
import UserDao from "./dao/UserDao";
import * as Database from "./Database";
import { APIVersionMiddleware } from "./middleware/APIVersionMiddleware";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware";
import { InvalidRouteMiddleware } from "./middleware/InvalidRouteMiddleware";
import { apiHeader, apiUrl } from "./utils/ApiUtils";
import { WebSocketServer } from "./WebSocket";

// Express instance
const app = express();

// CORS middleware
app.use(cors());

// Cookie parser
app.use(cookieParser());

const server = http.createServer(app);

// initialize WebSocket server
const ws = new WebSocketServer(server);

// Use Helmet
app.use(helmet());

// Knex instance
const knex = Database.connect();

// API version
const API_VERSION = "v1";

// JSON parser
app.use(express.json());

// Morgan
// Show failed requests only in development
if (process.env.NODE_ENV === "development") {
  app.use(
    morgan("dev", {
      skip(req, res) {
        return res.statusCode < 400;
      }
    })
  );
}
app.use(
  morgan("common", {
    stream: fs.createWriteStream(path.join(__dirname, "..", "access.log"), {
      flags: "a"
    })
  })
);

// API version header
app.use(APIVersionMiddleware(API_VERSION));

// Users route
app.use(
  apiUrl("users", API_VERSION),
  apiHeader(API_VERSION),
  new UserController(
    new UserDao(knex),
    new CalendarEventDao(knex),
    new MessageDao(knex),
    new NewsPostDao(knex),
    new SessionDao(knex),
    new KeyDao(knex)
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
  apiHeader(API_VERSION),
  new StudentUnionController(new StudentUnionDao(knex)).routes()
);

// Calendar route
app.use(
  apiUrl("calendar", API_VERSION),
  apiHeader(API_VERSION),
  new CalendarEventController(new CalendarEventDao(knex)).routes()
);

// Location route
app.use(
  apiUrl("location", API_VERSION),
  apiHeader(API_VERSION),
  new LocationController(new LocationDao(knex)).routes()
);

// Permission route
app.use(
  apiUrl("permission", API_VERSION),
  apiHeader(API_VERSION),
  new PermissionController().routes()
);

// Watch route
app.use(
  apiUrl("session", API_VERSION),
  apiHeader(API_VERSION),
  new SessionController(new SessionDao(knex), new UserDao(knex), ws).routes()
);

// Message route
app.use(
  apiUrl("message", API_VERSION),
  apiHeader(API_VERSION),
  new MessageController(new MessageDao(knex), new UserDao(knex)).routes()
);

// Newspost route
app.use(
  apiUrl("newspost", API_VERSION),
  apiHeader(API_VERSION),
  new NewsPostController(new NewsPostDao(knex)).routes()
);

// Statistics route
app.use(
  apiUrl("statistics", API_VERSION),
  apiHeader(API_VERSION),
  new StatisticsController(new StatisticsDao(knex), new UserDao(knex)).routes()
);

// Rules route
app.use(
  apiUrl("rule", API_VERSION),
  apiHeader(API_VERSION),
  new RuleController(new RuleDao(knex)).routes()
);

// Key types
app.use(
  apiUrl("keyType", API_VERSION),
  apiHeader(API_VERSION),
  new KeyTypeController(new KeyTypeDao(knex), new KeyDao(knex)).routes()
);

app.use(InvalidRouteMiddleware);

app.use(ErrorMiddleware);

const port = Number(process.env.PORT || 3001);

// Listen
server.listen(port, () => {
  console.log("Server running at ::%d", port);
});

export default server;
