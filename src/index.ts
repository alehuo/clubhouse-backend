import dotenv from "dotenv";
dotenv.config();

import moment from "moment";
import "moment/locale/fi";
moment.locale("fi");

import { server } from "./app";
import { logger } from "./logger";

const port = Number(process.env.PORT || 3001);

// Listen
server.listen(port, () => {
  logger.log("info", "Server running at ::" + port);
});

export default server;
