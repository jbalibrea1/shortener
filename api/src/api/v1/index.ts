import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { errorHandler } from './middleware';
import v1Routes from './routes';

const router = express.Router();

// Static files
router.use('/static', express.static(path.join(__dirname, 'static')));

// Routes
router.use('/', v1Routes);

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    uptime: process.uptime(),
    message: 'OK V1 API',
    timestamp: Date.now(),
    version: process.env.npm_package_version,
  });
});

// Middleware for handling unknown routes and errors
router.use(errorHandler);

export default router;
