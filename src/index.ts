import config from "config";
import express from "express";
import cookieParser from "cookie-parser";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";

const app = express();
const port = config.get<number>('port');
const host = config.get<string>('host');

app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }))

const start = async () => {
    await connect();
    app.listen(port, host, () => {
        logger.info(`Server listening at http://${host}:${port}...`);
    })
    routes(app);
};
start();
