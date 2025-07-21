import cors from 'cors';
import connectDB from '@/config/db';
import 'dotenv/config';
import express, {
  type Application,
  type Request,
  type Response,
} from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './api';
import logger from './logger';
import { unknownEndpoint } from './middleware/unknownEndpoint';

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:3000', // tu frontend
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        styleSrc: ["'self'", 'https://cdn.tailwindcss.com', "'unsafe-inline'"],
        scriptSrc: ["'self'", 'https://cdn.tailwindcss.com', "'unsafe-inline'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      },
    },
  }),
);

// DB connection
connectDB();

// API router
app.use('/api', apiRouter);

// health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    version: process.env.npm_package_version,
    env: process.env.NODE_ENV,
  });
});

// Middleware for handling unknown routes
app.use(unknownEndpoint);

// Manejo de errores globales y señales
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info(
    'SIGTERM received. Shutting down gracefully at ',
    new Date().toISOString(),
  );
  process.exit(0);
});

export default app;
