/**
 * Rutas de autenticación de usuarios (registro, login).
 * @module routes/v1/auth
 */

import userController from '@/controllers/userController';
import express from 'express';

const router = express.Router();

router.post('/', userController.login);
router.get('/', userController.getUser);
router.post('/register', userController.saveUser);

export default router;
