/**
 * Rutas para gestión de URLs acortadas (crear, listar, eliminar).
 * @module routes/v1/shorturl
 */

import shortURLController from '@/controllers/shortURLController';
import {
  authenticate,
  requireRole,
  validateShortUrlBody,
  validateShortUrlParam
} from '@/middleware';
import express from 'express';

const router = express.Router();

router.get(
  '/',
  authenticate,
  requireRole('admin'),
  shortURLController.getAllShortURLs
);
router.post('/', validateShortUrlBody, shortURLController.addShortURL);
router.get('/:shortUrl', validateShortUrlParam, shortURLController.getShortURL);
router.delete(
  '/:shortUrl',
  validateShortUrlParam,
  shortURLController.deleteShortURL
);

export default router;
