import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

const server = express();

import { recordLogsFromAllContainers } from './config/RecordLogs';

server.use(bodyParser.json());
server.use(cors());
server.use(cookieParser());

recordLogsFromAllContainers();

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});