/**
 * Rutas para la gestión administrativa de URLs acortadas y usuarios.
 * @module routes/v1/admin
 */

import { admin } from '@/api/v1/controllers/';
import { authenticate, requireRole } from '@/api/v1/middleware';
import express from 'express';

const router = express.Router();

router.get('/urls', authenticate, requireRole('admin'), admin.listAllShortURLs);
router.post('/promote', authenticate, requireRole('admin'), admin.promoteAdmin);
router.post('/demote', authenticate, requireRole('admin'), admin.demoteAdmin);

export default router;
