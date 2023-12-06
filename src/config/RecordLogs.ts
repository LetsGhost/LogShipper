import fs from 'fs';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import Docker from 'dockerode';
import stripAnsi from 'strip-ansi';
import { StringDecoder } from 'string_decoder';

const logDirectory = "./logs";
const docker = new Docker();

// Get a list of running Docker containers
const getRunningContainers = async () => {
  try {
    const containers = await docker.listContainers();
    return containers.map(container => ({id: container.Id, name: container.Names[0]}));
  } catch (error) {
    console.error(error);
  }
};

// Record logs from the running containers
const recordLogs = async () => {
  const containers = await getRunningContainers();

  const decoder = new StringDecoder('utf8');

  if(containers === undefined){
    console.error("No containers found");
    return;
  }

  for (const containerInfo of containers) {
    const container = docker.getContainer(containerInfo.id);
    const containerLogDirectory = `${logDirectory}/${containerInfo.name}`;
    console.log(`Recording logs for ${containerInfo.name}`);

    if (!fs.existsSync(containerLogDirectory)) {
      fs.mkdirSync(containerLogDirectory, { recursive: true });
    }

    const logger = winston.createLogger({
        format: winston.format.printf(({message}) => {
            return `${message}`;
        }),
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

    const stream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
      since: Math.floor(Date.now() / 1000) // Unix timestamp of current time
    });
      
    stream.on('data', data => {
        let cleanLine = stripAnsi(data.toString());
        cleanLine = cleanLine.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        cleanLine = cleanLine.replace(/�/g, '');
        logger.info(cleanLine.trim());
    });
  }
};

export {recordLogs}