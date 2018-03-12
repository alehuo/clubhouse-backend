require("dotenv").config();

import * as express from "express";
import ImageController from "./controllers/ImageController";
import ImageDataController from "./controllers/ImageDataController";
import * as Database from "./Database";
import ImageDao from "./repository/ImageDao";
import ImageDataDao from "./repository/ImageDataDao";

const app: express.Application = express();

const knex = Database.connect();

app.use(express.json());

app.use("/api/images", new ImageController(new ImageDao(knex)).routes());
app.use("/api/imageData", new ImageDataController(new ImageDataDao(knex)).routes());
app.listen(process.env.SERVER_PORT, () => {
  console.log("Server running at ::%d", process.env.SERVER_PORT);
});
