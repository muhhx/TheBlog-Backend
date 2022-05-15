import config from "config";
import express from "express";
import connect from "./utils/connect";
import routes from "./routes";
import logger from "./utils/logger";

const app = express();
const port = config.get<number>('port')
const host = config.get<string>('host')

const start = async () => {
    await connect()
    app.listen(port, host, () => {
        logger.info(`Server listening at http://${host}:${port}...`)
    })
    routes(app)
}
start()
