import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import path from "path";
import { WebSocketServer } from "./WebSocket";

import AuthController from "./controllers/AuthController";
import CalendarEventController from "./controllers/CalendarEventController";
import KeyController from "./controllers/KeyController";
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
import { APIVersionMiddleware } from "./middleware/APIVersionMiddleware";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware";
import { InvalidRouteMiddleware } from "./middleware/InvalidRouteMiddleware";
import { apiHeader, apiUrl } from "./utils/ApiUtils";

// Express instance
const app = express();

// CORS middleware
app.use(cors());

// Cookie parser
app.use(cookieParser());

// Use Helmet
app.use(helmet());

// JSON parser
app.use(express.json());

const server = http.createServer(app);

// initialize WebSocket server
const ws = new WebSocketServer(server);

// API version
export const API_VERSION = "v1";

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
  UserController.routes()
);

// Auth route
app.use(apiUrl("authenticate", API_VERSION), AuthController.routes());

// Student unions route
app.use(
  apiUrl("studentunion", API_VERSION),
  apiHeader(API_VERSION),
  StudentUnionController.routes()
);

// Calendar route
app.use(
  apiUrl("calendar", API_VERSION),
  apiHeader(API_VERSION),
  CalendarEventController.routes()
);

// Location route
app.use(
  apiUrl("location", API_VERSION),
  apiHeader(API_VERSION),
  LocationController.routes()
);

// Permission route
app.use(
  apiUrl("permission", API_VERSION),
  apiHeader(API_VERSION),
  PermissionController.routes()
);

// Watch route
app.use(
  apiUrl("session", API_VERSION),
  apiHeader(API_VERSION),
  SessionController.routes()
);

// Message route
app.use(
  apiUrl("message", API_VERSION),
  apiHeader(API_VERSION),
  MessageController.routes()
);

// Newspost route
app.use(
  apiUrl("newspost", API_VERSION),
  apiHeader(API_VERSION),
  NewsPostController.routes()
);

// Statistics route
app.use(
  apiUrl("statistics", API_VERSION),
  apiHeader(API_VERSION),
  StatisticsController.routes()
);

// Rules route
app.use(
  apiUrl("rule", API_VERSION),
  apiHeader(API_VERSION),
  RuleController.routes()
);

// Key types route
app.use(
  apiUrl("keyType", API_VERSION),
  apiHeader(API_VERSION),
  KeyTypeController.routes()
);

// Keys route
app.use(
  apiUrl("key", API_VERSION),
  apiHeader(API_VERSION),
  KeyController.routes()
);

app.use(InvalidRouteMiddleware);

app.use(ErrorMiddleware);

export { app, server, ws };
