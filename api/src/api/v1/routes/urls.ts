/**
 * Rutas para gestión de URLs acortadas (crear, listar, eliminar).
 * @module routes/v1/shorturl
 */

import express from 'express';
import { shortURL } from '@/api/v1/controllers';
import {
  authenticate,
  validateShortUrlBody,
  validateShortUrlParam,
} from '@/api/v1/middleware';

const router = express.Router();

router.get('/', authenticate, shortURL.listShortURLs);
router.post('/', validateShortUrlBody, shortURL.createShortURL);
// TODO: delete maybe
// router.get('/:shortUrl', authenticate, validateShortUrlParam, shortURL.getShortURLInfo);
router.delete(
  '/:shortCode',
  authenticate,
  validateShortUrlParam,
  shortURL.removeShortURL
);

export default router;
