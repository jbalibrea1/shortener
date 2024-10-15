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
app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});
app.use(router);

// Middleware for handling unknown routes and errors
app.use(middleware.unknownEndpoint);
app.use(middleware.errorMidHandler);

export default app;
