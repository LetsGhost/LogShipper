import { Request, Response } from 'express';
import LogService from '../Service/LogService';

class LogController {
    async getFolderList(req: Request, res: Response) {
        const {success, code, message, folderList} = await LogService.getFolderList();
        return res.status(code).json({success, message, folderList});
    }

    async getLogsList(req: Request, res: Response) {
        const {success, code, message, logList} = await LogService.getLogsList(req.params.folderName);
        return res.status(code).json({success, message, logList});
    }

    async getLog(req: Request, res: Response) {
        const {success, code, message, log} = await LogService.getLog(req.params.folderName, req.params.logName);
        return res.status(code).json({success, message, log});
    }
}

export default new LogController();