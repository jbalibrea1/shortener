import express from 'express';
import { analytics } from '@/api/v1/controllers';
import { authenticate } from '@/api/v1/middleware';

const router = express.Router();

router.get(
  '/user/global-metrics',
  authenticate,
  analytics.getUserGlobalMetrics,
);
router.get('/user/urls', authenticate, analytics.getAllAnalytics);
router.get(
  '/user/urls/:shortCode',
  authenticate,
  analytics.getShortUrlAnalytics,
);
router.get('/by-day', authenticate, analytics.getDailyClicks);
router.get(
  '/by-day/:shortCode',
  authenticate,
  analytics.getShortUrlClicksByDay,
);

export default router;
