import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Esquema de validación para las variables de entorno
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  SECRET: z.string(),
  MONGODB_URI: z.string(),
  MONGODB_URI_PROD: z.string().optional(),
  MONGODB_URI_TEST: z.string().optional()
});

const env = envSchema.parse(process.env);

const MONGODB_URI =
  env.NODE_ENV === 'test'
    ? env.MONGODB_URI_TEST
    : env.NODE_ENV === 'production'
      ? env.MONGODB_URI_PROD
      : env.MONGODB_URI;

const config = {
  env: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
  port: env.PORT,
  jwtSecret: env.SECRET,
  mongoUri: MONGODB_URI
};

export default config;
