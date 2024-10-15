import express from 'express';
import shortURLController from '../controllers/shortURLController';
import asyncHandler from '../middleware/asyncHandler';

const router = express.Router();

router.get('/:shortURL', asyncHandler(shortURLController.getRedirect));

export { router };
