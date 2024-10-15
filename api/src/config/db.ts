import mongoose from 'mongoose';

const connectDB = () => {
  mongoose.set('strictQuery', false);

  const url = process.env.MONGODB_URI;
  console.log('connecting to', url);
  if (!url) {
    console.log('No MongoDB URI provided');
    process.exit(1);
  }

  mongoose
    .connect(url)
    .then((_result) => {
      console.log('connected to MongoDB');
    })
    .catch((error: Error) => {
      console.log('error connecting to MongoDB:', error.message);
    });
};

export default connectDB;
