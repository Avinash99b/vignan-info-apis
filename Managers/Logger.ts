import {existsSync, mkdirSync} from 'fs';
import {join} from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';

class Logger {
    private static logDir: string = join(process.cwd(), 'logs');
    static {
        if (!existsSync(this.logDir)) {
            mkdirSync(this.logDir);
        }
    }
    private static maxLogFileSize = 30;

    static transport = new winston.transports.DailyRotateFile({
        filename: `${this.logDir}/bma-%DATE%.log`, // Specify your file path here
        datePattern: 'DD-MM-YYYY',
        zippedArchive: true, // Compress old logs
        maxSize: Logger.maxLogFileSize+'m', // Max size of each log file
        maxFiles: '14d', // Keep logs for 14 days
    });

    static logger = winston.createLogger({
        level: 'info', // Set the logging level
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            this.transport,
            new winston.transports.Console() // Also log to console
        ]
    });

    static getLogger(){
        return this.logger;
    }

    static logAction(user:string,action: string, message: string){

    }
}

export default Logger;
