/**
 * Rutas de autenticación de usuarios (registro, login).
 * @module routes/v1/auth
 */

import userController from '@/controllers/userController';
import { authenticate, validateData } from '@/middleware';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import express from 'express';

const router = express.Router();

router.post('/login', validateData(loginSchema), userController.login);
router.get('/me', authenticate, userController.getUser);
router.post('/register', validateData(registerSchema), userController.saveUser);

export default router;
