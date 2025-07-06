/**
 * Rutas para la gestión administrativa de URLs acortadas y usuarios.
 * @module routes/v1/admin
 */

import adminController from '@/controllers/adminController';
import { authenticate, requireRole } from '@/middleware';
import express from 'express';

const router = express.Router();

router.get(
  '/urls',
  authenticate,
  requireRole('admin'),
  adminController.listAllShortURLs
);

router.post(
  '/promote',
  authenticate,
  requireRole('admin'),
  adminController.promoteAdmin
);

router.post(
  '/demote',
  authenticate,
  requireRole('admin'),
  adminController.demoteAdmin
);

export default router;
