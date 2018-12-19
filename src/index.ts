import dotenv from "dotenv";
dotenv.config();

import moment from "moment";
import "moment/locale/fi";
moment.locale("fi");

import cookieParser from "cookie-parser";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import path from "path";
import AuthController from "./controllers/AuthController";
import CalendarEventController from "./controllers/CalendarEventController";
import LocationController from "./controllers/LocationController";
import MessageController from "./controllers/MessageController";
import NewsPostController from "./controllers/NewsPostController";
import PermissionController from "./controllers/PermissionController";
import SessionController from "./controllers/SessionController";
import StatisticsController from "./controllers/StatisticsController";
import StudentUnionController from "./controllers/StudentUnionController";
import UserController from "./controllers/UserController";
import CalendarEventDao from "./dao/CalendarEventDao";
import LocationDao from "./dao/LocationDao";
import MessageDao from "./dao/MessageDao";
import NewsPostDao from "./dao/NewsPostDao";
import SessionDao from "./dao/SessionDao";
import StatisticsDao from "./dao/StatisticsDao";
import StudentUnionDao from "./dao/StudentUnionDao";
import UserDao from "./dao/UserDao";
import * as Database from "./Database";
import { apiHeader, apiUrl } from "./utils/ApiUtils";
import { WebSocketServer } from "./WebSocket";

// Express instance
const app = express();

app.use(cookieParser());

const server = http.createServer(app);

// initialize WebSocket server
const ws = new WebSocketServer(server);

// Use Helmet
app.use(helmet());

// Middleware to set Access-Control origin
// TODO: Replace with cors middleware
if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      req.headers.origin || "localhost"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, PATCH, OPTIONS, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Accept, X-Requested-With, Authorization"
    );
    res.setHeader("Access-Control-Max-Age", "3600");
    next();
  });
}

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
app.use((req, res, next) => {
  res.setHeader("X-Latest-API-Version", API_VERSION);
  next();
});

// Users route
app.use(
  apiUrl("users", API_VERSION),
  apiHeader(API_VERSION),
  new UserController(
    new UserDao(knex),
    new CalendarEventDao(knex),
    new MessageDao(knex),
    new NewsPostDao(knex),
    new SessionDao(knex)
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

const port = Number(process.env.PORT || 3001);

// Listen
server.listen(port, () => {
  console.log("Server running at ::%d", port);
});

export default server;
