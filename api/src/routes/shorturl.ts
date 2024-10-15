import express from 'express';
import shortURLController from '../controllers/shortURLController';
import asyncHandler from '../middleware/asyncHandler';

const router = express.Router();

router.get('/', asyncHandler(shortURLController.getAllShortURLs));
router.post('/', asyncHandler(shortURLController.addShortURL));
router.get('/:shorturl', asyncHandler(shortURLController.getShortURL));
router.delete('/:surl', asyncHandler(shortURLController.deleteShortURL));

export { router };
