/**
 * Rutas para redirección a URLs originales a partir de shortURLs.
 * @module routes/v1/redirect
 */

import express from 'express';
import { shortURL } from '@/api/v1/controllers';

const router = express.Router();

router.get('/:shortCode', shortURL.redirectShortURL);

export default router;
