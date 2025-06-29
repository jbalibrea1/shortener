/**
 * Rutas para gestión de URLs acortadas (crear, listar, eliminar).
 * @module routes/v1/shorturl
 */

import shortURLController from '@/controllers/shortURLController';
import express from 'express';

const router = express.Router();

router.get('/', shortURLController.getAllShortURLs);
router.post('/', shortURLController.addShortURL);
router.get('/:surl', shortURLController.getShortURL);
router.delete('/:surl', shortURLController.deleteShortURL);

export default router;
