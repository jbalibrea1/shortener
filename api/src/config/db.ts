import logger from '@/logger';
import mongoose from 'mongoose';
import config from '.';

const connectDB = () => {
  mongoose.set('strictQuery', false);

  const url = config.mongoUri;
  if (config.env !== 'production') {
    logger.info(`Connecting to MongoDB at ${url}`);
  }
  if (!url) {
    logger.error('No MongoDB URI provided');
    process.exit(1);
  }

  mongoose
    .connect(url)
    .then((_result) => {
      logger.info('Connected to MongoDB');
    })
    .catch((error: Error) => {
      logger.error(`error connecting to MongoDB: ${error.message}`);
    });
};

export default connectDB;
