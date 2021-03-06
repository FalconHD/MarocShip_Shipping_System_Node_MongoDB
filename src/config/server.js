import express, { json, static as staticPath } from "express"
import 'dotenv/config';
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";

const { PORT, NODE_ENV } = process.env;

export const app = express()

export const startServer = async (app) => {

    app.use(json());
    app.use(cors());
    app.use(helmet());
    app.use("views", staticPath(__dirname + "/views"));
    app.use(morgan('dev'))
    morgan.token('by', function getName(req) {
        return req?.User?.name;
    })
    morgan.token('role', function getRole(req) {
        return req?.User?.role;
    })
    morgan.token('to', function getBy(req) {
        return req?.to;
    })
    morgan.token('toId', function getBy(req) {
        return req?.toId;
    })
    morgan.token('id', function getTo(req) {
        return req?.User?.id || req?.User?._id;
    })
    app.use(morgan('#:id# :role :by :method :status :url :toId :to || :date[clf]', { stream: fs.createWriteStream('./access.log', { flags: 'a' }) }))

    app.use(staticPath('public'));


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })

}