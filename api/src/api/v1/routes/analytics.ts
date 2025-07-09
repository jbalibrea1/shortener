import { analytics } from '@/api/v1/controllers';
import { authenticate } from '@/api/v1/middleware';
import express from 'express';

const router = express.Router();

router.get('/user/urls', authenticate, analytics.getAllAnalytics);
router.get('/user/urls/:shortUrl', authenticate, analytics.getShortUrlAnalytics);
router.get('/by-day', authenticate, analytics.getDailyClicks);
router.get('/by-day/:shortUrl', authenticate, analytics.getShortUrlClicksByDay);


export default router;
