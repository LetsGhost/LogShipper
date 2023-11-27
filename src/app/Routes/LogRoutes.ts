import express from 'express';

import AuthenticateToken from '../Middleware/AuthenticateToken';
import AuthenticateRole from '../Middleware/AuthenticateRole';

import LogController from '../Controller/LogController';

const router = express.Router();

router.get('/getFolderList', LogController.getFolderList);
router.get('/getLogList/:folderName', LogController.getLogsList);
router.get('/getLog/:folderName/:logName', LogController.getLog);

export default router