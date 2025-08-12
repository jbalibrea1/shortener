/**
 * Rutas de autenticación de usuarios (registro, login).
 * @module routes/v1/auth
 */

import express from 'express';
import { user } from '@/api/v1/controllers';
import { authenticate, validateData } from '@/api/v1/middleware';
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from '@/api/v1/schemas/auth.schema';

const router = express.Router();

router.post('/login', validateData(loginSchema), user.login);
router.get('/me', authenticate, user.getUser);
router.post('/register', validateData(registerSchema), user.saveUser);
router.post('/logout', authenticate, user.logout);
router.post('/refreshToken', user.refreshToken);
router.put(
  '/me',
  authenticate,
  validateData(updateProfileSchema),
  user.updateProfile
);

export default router;
