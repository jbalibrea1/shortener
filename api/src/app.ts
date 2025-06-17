import 'dotenv/config';
import express from 'express';
import connectDB from './config/db';
import middleware from './middleware';

import cors from 'cors';
import { router } from './routes';
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

// DB connection
connectDB();

// Routes
app.use(router);

// /health endpoint to check if the API is running
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Middleware for handling unknown routes and errors
app.use(middleware.unknownEndpoint);
app.use(middleware.errorMidHandler);

export default app;
