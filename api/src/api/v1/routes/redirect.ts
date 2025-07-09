/**
 * Rutas para redirección a URLs originales a partir de shortURLs.
 * @module routes/v1/redirect
 */

import { shortURL } from '@/api/v1/controllers';
import express from 'express';

const router = express.Router();

router.get('/:shortUrl', shortURL.redirectShortURL);

export default router;
