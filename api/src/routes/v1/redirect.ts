/**
 * Rutas para redirección a URLs originales a partir de shortURLs.
 * @module routes/v1/redirect
 */

import shortURLController from '@/controllers/shortURLController';
import express from 'express';

const router = express.Router();

router.get('/:shortURL', shortURLController.getRedirect);

export default router;
