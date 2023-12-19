import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import AuthenticateToken from '../Middleware/AuthenticateToken.js';
import AuthenticateRole from '../Middleware/AuthenticateRole.js';

import LogController from '../Controller/LogController.js';

const router = express.Router();

if(process.env.ENV === 'production') {
    router.use(AuthenticateToken.authenticateToken);
    router.use(AuthenticateRole.authenticateRole);
}

router.get('/getFolderList', LogController.getFolderList);
router.get('/getLogList/:folderName', LogController.getLogsList);
router.get('/getLog/:folderName/:logName', LogController.getLog);
router.get('/searchForNewContainer', LogController.searchForNewContainer);

export default router