import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import AuthenticateToken from '../Middleware/AuthenticateToken';
import AuthenticateRole from '../Middleware/AuthenticateRole';

import LogController from '../Controller/LogController';

const router = express.Router();

if(process.env.NODE_ENV === 'production') {
    router.use(AuthenticateToken.authenticateToken);
    router.use(AuthenticateRole.authenticateRole);
}

router.get('/getFolderList', LogController.getFolderList);
router.get('/getLogList/:folderName', LogController.getLogsList);
router.get('/getLog/:folderName/:logName', LogController.getLog);

export default router