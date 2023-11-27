import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

const server = express();

import {recordLogs} from './config/RecordLogs';

import logRoutes from './app/Routes/LogRoutes';

server.use(bodyParser.json());
server.use(cors());
server.use(cookieParser());

server.use("/log", logRoutes)

recordLogs();
setInterval(recordLogs, 5 * 60 * 1000);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});