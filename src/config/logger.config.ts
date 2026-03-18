import winston from 'winston';
import AppConstants from '../constants';
import { FileHelper } from '../helpers';

class LoggerManager {
  private static instance: winston.Logger;

  private constructor() {}

  public static initialize(): void {
    if (!LoggerManager.instance) {
      const { AppLoggerColors, AppLoggerLevels } = AppConstants.getLoggerConstants();
      const format = winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.colorize({ all: true }),
        winston.format.printf((info) => `${info.timestamp} [${info.level}] : ${info.message}`)
      );
      const transports = [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: FileHelper.getAbsolutePath('./logs/error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: FileHelper.getAbsolutePath('./logs/info.log'),
          level: 'info',
        }),
        new winston.transports.File({
          filename: FileHelper.getAbsolutePath('./logs/debug.log'),
          level: 'debug',
        }),
        new winston.transports.File({
          filename: FileHelper.getAbsolutePath('./logs/warn.log'),
          level: 'warn',
        }),
        new winston.transports.File({
          filename: FileHelper.getAbsolutePath('./logs/http.log'),
          level: 'http',
        }),
      ];

      winston.addColors(AppLoggerColors);
      LoggerManager.instance = winston.createLogger({
        level: 'debug',
        levels: AppLoggerLevels,
        format,
        transports,
      });
    }
  }

  public static getInstance(): winston.Logger {
    if (!LoggerManager.instance) {
      LoggerManager.initialize();
    }

    return LoggerManager.instance;
  }
}

export default LoggerManager;
