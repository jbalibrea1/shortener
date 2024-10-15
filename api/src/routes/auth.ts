import express from 'express';
import userController from '../controllers/userController';
import asyncHandler from '../middleware/asyncHandler';

const router = express.Router();

router.post('/', asyncHandler(userController.login));
router.get('/', asyncHandler(userController.getUser));
router.post('/register', asyncHandler(userController.saveUser));

export { router };
