/**
 * Rutas para gestión de URLs acortadas (crear, listar, eliminar).
 * @module routes/v1/shorturl
 */

import shortURLController from '@/controllers/shortURLController';
import {
  authenticate,
  validateShortUrlBody,
  validateShortUrlParam
} from '@/middleware';
import express from 'express';

const router = express.Router();

router.get('/', authenticate, shortURLController.listShortURLs);
router.post('/', validateShortUrlBody, shortURLController.createShortURL);
router.get(
  '/:shortUrl',
  validateShortUrlParam,
  shortURLController.getShortURLInfo
);
router.delete(
  '/:shortUrl',
  authenticate,
  validateShortUrlParam,
  shortURLController.removeShortURL
);

export default router;
