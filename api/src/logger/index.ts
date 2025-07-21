import winston from 'winston';
import config from '@/config';

/**
 * Logger utility using Winston, with file logging in production and console in development.
 * @module utils/logger
 */

const transports = [];

if (config.env !== 'production') {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/app.log' }),
  );
}

// Siempre consola, excepto en test
if (config.env !== 'test') {
  transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    // winston.format.printf(({ timestamp, level, message }) => {
    //   return `${timestamp} [${level}]: ${message}`;
    // })
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ''
      }`;
    }),
  ),
  transports,
});

export default logger;
