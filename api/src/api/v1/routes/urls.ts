/**
 * Rutas para gestión de URLs acortadas (crear, listar, eliminar).
 * @module routes/v1/shorturl
 */

import { shortURL } from '@/api/v1/controllers';
import {
  authenticate,
  validateShortUrlBody,
  validateShortUrlParam
} from '@/api/v1/middleware';
import express from 'express';

const router = express.Router();

router.get('/', authenticate, shortURL.listShortURLs);
router.post('/', validateShortUrlBody, shortURL.createShortURL);
// router.get('/:shortUrl', authenticate, validateShortUrlParam, shortURL.getShortURLInfo);
router.delete(
  '/:shortUrl',
  authenticate,
  validateShortUrlParam,
  shortURL.removeShortURL
);

export default router;
