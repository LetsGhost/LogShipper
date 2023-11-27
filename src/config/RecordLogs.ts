import { createLogger, transports } from 'winston';
import { execSync } from 'child_process';
import * as fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file';

// Function to record logs from all running Docker containers
function recordLogsFromAllContainers() {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs');
    }

    // Get a list of all running container names
    const command = 'docker ps --format "{{.Names}}"';
    const containerNames = execSync(command).toString().split('\n').filter(Boolean);

    // Iterate over each container and record logs
    containerNames.forEach((containerName) => {
        // Create a folder for the container if it doesn't exist
        const containerLogsDir = `logs/${containerName}`;
        if (!fs.existsSync(containerLogsDir)) {
            fs.mkdirSync(containerLogsDir);
        }

        // Create a Winston logger with DailyRotateFile transport
        const logger = createLogger({
            transports: [
                new DailyRotateFile({
                    filename: `${containerLogsDir}/%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
            ],
        });

        // Execute Docker logs command and write the output to the logger
        const logsCommand = `docker logs ${containerName}`;
        const logs = execSync(logsCommand).toString().split('\n');
        logs.forEach(log => {
            logger.info(log);
        });
        
        // Watch for changes in the log file
        const logFilePath = `${containerLogsDir}/%DATE%.log`;
        fs.watch(logFilePath, (eventType, filename) => {
            if (eventType === 'change') {
                const updatedLogs = fs.readFileSync(logFilePath, 'utf8');
                logger.info(updatedLogs);
            }
        });
    });
}



// Example usage
export { recordLogsFromAllContainers}
