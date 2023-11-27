import fs from 'fs/promises';

class LogService {
    async getFolderList() {
        try {
            const folderList = await fs.readdir("./logs");

            if(!folderList){
                return {
                    success: false,
                    code: 404,
                    message: "No logs found"
                }
            }

            return {
                success: true,
                code: 200,
                folderList
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                code: 500,
                message: "Internal server error"
            }
        }
    }

    async getLogsList(folderName: string) {
        try {
            const logList = await fs.readdir(`./logs/${folderName}`);

            if(!logList){
                return {
                    success: false,
                    code: 404,
                    message: "No logs found"
                }
            }

            return {
                success: true,
                code: 200,
                logList
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                code: 500,
                message: "Internal server error"
            }
        }
    }

    async getLog(folderName: string, logName: string) {
        try {
            const log = await fs.readFile(`./logs/${folderName}/${logName}`, "utf-8");

            if(!log){
                return {
                    success: false,
                    code: 404,
                    message: "No logs found"
                }
            }

            return {
                success: true,
                code: 200,
                log
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                code: 500,
                message: "Internal server error"
            }
        }
    }
}

export default new LogService();