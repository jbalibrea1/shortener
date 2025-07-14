/** biome-ignore-all lint/suspicious/noConsole: <its okay> */
/**
 * Rutas principales de la API v1. Carga dinámica de routers de la versión 1.
 * @module routes/index
 */

import { Router } from 'express';
import { readdirSync } from 'fs';

const PATH_ROUTER = __dirname;
const router = Router();

/**
 * Limpia el nombre del archivo para usarlo como endpoint.
 * @param fileName - Nombre del archivo a limpiar.
 * @returns Nombre limpio del archivo o undefined si no es válido.
 */
const cleanFileName = (fileName: string): string | undefined => {
  return fileName.toLowerCase().split('.').shift();
};

// Carga dinámica de todos los routers en la carpeta actual, excepto index.js
readdirSync(PATH_ROUTER).filter((fileName) => {
  const cleanName = cleanFileName(fileName);
  if (cleanName !== 'index') {
    const endpoint = `/${cleanName}`;
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
