import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';
import * as middleware from './middleware';
import v1Routes from './routes/v1';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// DB connection
connectDB();

// Routes
app.use('/api/v1', v1Routes);

// Middleware for handling unknown routes and errors
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
