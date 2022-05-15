import { Express } from "express";

export default function routes (app: Express) {
    app.get("/", (req, res) => {
        res.status(200).send("Hello world")
    })
    app.get("/teste", (req, res) => {
        res.status(200).send("231231 world")
    })
};
