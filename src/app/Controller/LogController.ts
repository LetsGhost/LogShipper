import { Request, Response } from 'express';
import LogService from '../Service/LogService.js';

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

    async searchForNewContainer(req: Request, res: Response) {
        try{
            const result = await LogService.searchforNewContainers();
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, message: "Internal server error"});
        }
    }    
}

export default new LogController();