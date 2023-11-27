import { spawn } from 'child_process';
import fs from 'fs';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import readline from 'readline';

const logDirectory = "./logs";

// Get a list of running Docker containers
const getRunningContainers = () => {
    try{
        return new Promise<string[]>((resolve, reject) => {
            const dockerProcess = spawn('docker', ['ps', '-q']);
    
            let output = '';
    
            dockerProcess.stdout.on('data', (data) => {
                output += data.toString();
            });
    
            dockerProcess.on('close', (code) => {
                if (code === 0) {
                    const containerIds = output.trim().split('\n');
                    resolve(containerIds);
                } else {
                    reject(new Error('Failed to get running containers'));
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
};

const getContainerNames = () => {
    return new Promise<string[]>((resolve, reject) => {
        const dockerProcess = spawn('docker', ['ps', '-a', '--format', '{{.Names}}']);

        let output = '';

        dockerProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        dockerProcess.on('close', (code) => {
            if (code === 0) {
                const containerNames = output.trim().split('\n');
                resolve(containerNames);
            } else {
                reject(new Error('Failed to get container names'));
            }
        });

        console.log('getContainerNames() output: ', output);
    });
};

// Record logs from each Docker container
export const recordLogs = async () => {
    try {
        const containerIds = await getRunningContainers();
        const containerNames = await getContainerNames();
        console.log('containerIds: ', containerNames);

        // Check if containerIds is defined
        if (!containerIds) {
            console.error('No running containers found');
            return;
        }

        const containers = containerIds.map((id, index) => ({ id, name: containerNames[index] }));

        const sinceTimestamp = new Date().toISOString();

        containers.forEach((container) => {
            console.log(`Recording logs for container: ${container.name}`);  // Add this line
            // Create a directory for the container if it doesn't exist
            const containerLogDirectory = `${logDirectory}/${container.name}`;
            if (!fs.existsSync(containerLogDirectory)) {
                console.log(`Creating directory: ${containerLogDirectory}`);  // Add this line
                try {
                    fs.mkdirSync(containerLogDirectory, { recursive: true });
                } catch (error) {
                    console.error(`Failed to create directory: ${error}`);  // Add this line
                }
            }
        
            const containerLogger = winston.createLogger({
                format: winston.format.printf(({ message }) => message),
                transports: [
                    new DailyRotateFile({
                        dirname: containerLogDirectory,
                        filename: '%DATE%.log',
                        datePattern: 'DD-MM-YYYY',
                        zippedArchive: true,
                        maxSize: '20m',
                        maxFiles: '14d',
                    }),
                ],
            });
        
            const logProcess = spawn('docker', ['logs', '-f', '--since', sinceTimestamp, container.id]);
        
            const logLineReader = readline.createInterface({
                input: logProcess.stdout,
                output: process.stdout,
                terminal: false
            });
        
            logLineReader.on('line', (line) => {
                containerLogger.info(line.trim());
            });
        
            const errorLineReader = readline.createInterface({
                input: logProcess.stderr,
                output: process.stdout,
                terminal: false
            });
        
            errorLineReader.on('line', (line) => {
                containerLogger.error(line.trim());
            });
        });
    } catch (error) {
        console.error(error);
    }
};
