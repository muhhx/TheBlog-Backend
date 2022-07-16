const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();

import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const start = async () => {
  await connect();
  app.listen(port, () => {
    logger.info(`Server listening at port ${port}...`);
  });
  routes(app);
};
start();
