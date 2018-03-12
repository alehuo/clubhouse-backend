require("dotenv").config();

import * as express from "express";
import FolderController from "./controllers/FolderController";
import ImageController from "./controllers/ImageController";
import ImageDataController from "./controllers/ImageDataController";

const app: express.Application = express();

app.use(express.json());

app.use("/api/folders", FolderController);
app.use("/api/images", ImageController);
app.use("/api/imageData", ImageDataController);

app.listen(8081, () => {
  console.log("jee");
});
