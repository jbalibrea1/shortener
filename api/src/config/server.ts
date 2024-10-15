import 'dotenv/config';

const PORT = process.env.PORT;
const DB_COLLECTION = process.env.DB_COLLECTION;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

export default {
  MONGODB_URI,
  PORT,
  DB_COLLECTION,
};
