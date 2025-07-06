import analyticsController from '@/controllers/analyticsController';

import { authenticate } from '@/middleware';
import express from 'express';

const router = express.Router();

router.get('/', authenticate, analyticsController.getUserAnalytics);
router.get('/by-day', authenticate, analyticsController.getUserClicksByDay);
router.get(
  '/:shortUrl',
  authenticate,
  analyticsController.getShortUrlAnalytics
);

export default router;
