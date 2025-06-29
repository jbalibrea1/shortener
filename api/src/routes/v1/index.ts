/**
 * Rutas principales de la API v1. Carga dinámica de routers de la versión 1.
 * @module routes/v1/index
 */

import { Router } from 'express';
import { readdirSync } from 'fs';

const PATH_ROUTER = __dirname;
const prefix = '';
const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'API v1 is running' });
});

const cleanFileName = (fileName: string): string | undefined => {
  return fileName.toLowerCase().split('.').shift();
};

readdirSync(PATH_ROUTER).filter((fileName) => {
  const cleanName = cleanFileName(fileName);
  if (cleanName !== 'index') {
    const endpoint = `${prefix}/${cleanName}`;
    import(`./${cleanName}`)
      .then((moduleRouter: { default: Router }) => {
        router.use(`${endpoint}`, moduleRouter.default);
        console.info(`Router v1 ------> ${endpoint} loaded`);
      })
      .catch((error) => {
        console.error(`Failed to load router v1 /${cleanName}`, error);
      });
  }
});

export default router;
