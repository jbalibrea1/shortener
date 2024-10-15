import { Router } from 'express';
import { readdirSync } from 'fs';

const PATH_ROUTER = `${__dirname}`;
const prefix = '/api';
const router = Router();

/**
 * shortURL.ts -> shortURL
 * @returns {string|undefined} - The file name without extension
 */
const cleanFileName = (fileName: string): string | undefined => {
  return fileName.split('.').shift();
};

readdirSync(PATH_ROUTER).filter((fileName) => {
  const cleanName = cleanFileName(fileName);
  if (cleanName !== 'index') {
    const endpoint = `${prefix}/${cleanName}`;
    import(`./${cleanName}`)
      .then((moduleRouter: { router: Router }) => {
        router.use(`${endpoint}`, moduleRouter.router);
        console.info(`Router ------> ${endpoint} loaded`);
      })
      .catch((error) => {
        console.error(`Failed to load router /${cleanName}`, error);
      });
  }
});

export { router };
