import express from "express";
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";

const app = express();
const port = config.get<number>('port')
const host = config.get<string>('host')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const start = async () => {
    try {
        await connect()
        app.listen(port, host, () => {
            logger.info(`Server listening at http://${host}:${port}...`)
        })
    } catch (error) {
        logger.error(error)
    }
}
start()
