require("dotenv").config();

import * as express from "express";
import * as Knex from "knex";
import * as morgan from "morgan";
import * as compression from "compression";
// const apicache = require("apicache");
import ImageController from "./controllers/ImageController";
import ImageDataController from "./controllers/ImageDataController";
import UserController from "./controllers/UserController";
import * as Database from "./Database";
import ImageDao from "./repository/ImageDao";
import ImageDataDao from "./repository/ImageDataDao";
import UserDao from "./repository/UserDao";

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
// app.use(morgan("tiny"));

// Compression
app.use(compression());

// API cache
/*const cache = apicache.middleware;
app.use(cache("5 minutes"));*/

// Images route
app.use(apiUrl("images"), new ImageController(new ImageDao(knex)).routes());

// ImageData route
app.use(
  apiUrl("imageData"),
  new ImageDataController(new ImageDataDao(knex)).routes()
);

// Users route
app.use(apiUrl("users"), new UserController(new UserDao(knex)).routes());

// Listen
app.listen(process.env.SERVER_PORT, () => {
  console.log("Server running at ::%d", process.env.SERVER_PORT);
});
