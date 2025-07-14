import { Response } from 'express';
import { IJwtRequest } from '@/api/v1/interfaces';
import analytics from '@/api/v1/services/analytics.service';
import { UnauthorizedError } from '@/api/v1/utils/errors';
import { successResponse } from '@/api/v1/utils/responses';

/**
 * Devuelve todas las URLs del usuario autenticado con analíticas.
 */

export const getAllAnalytics = async (req: IJwtRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    throw new UnauthorizedError('No authorization token provided');
  }
  // Query params parsed
  const options = {
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    order: req.query.order as 'asc' | 'desc' | undefined,
    sortBy: req.query.sortBy as 'totalClicks' | 'createdAt' | 'lastClickedAt',
    dailyClicks: req.query.dailyClicks === 'true',
  };

  const { data, pagination } = await analytics.getAnalytics(user, options);
  successResponse({ res, data, pagination });
};

/**
 * Devuelve la analítica de una shortUrl concreta del usuario autenticado.
 */
export const getShortUrlAnalytics = async (req: IJwtRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    throw new UnauthorizedError('No authorization token provided');
  }
  const { shortCode } = req.params;
  const data = await analytics.getShortUrlAnalytics(user, shortCode);
  successResponse({ res, data });
};

export const getDailyClicks = async (req: IJwtRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    throw new UnauthorizedError('No authorization token provided');
  }

  const options = {
    days: req.query.days ? Number(req.query.days) : undefined,
    order: req.query.order as 'asc' | 'desc' | undefined,
    includeUrls: req.query.includeUrls === 'true',
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    page: req.query.page ? Number(req.query.page) : 1,
  };

  const { data, pagination } = await analytics.getDailyClicks(user, options);
  successResponse({ res, data, pagination });
};

/**
 * Devuelve los clics por día sumados de un shortCode concreto del usuario autenticado.
 */
export const getShortUrlClicksByDay = async (
  req: IJwtRequest,
  res: Response
) => {
  const user = req.user;
  if (!user || !user.id) {
    throw new UnauthorizedError('No authorization token provided');
  }
  const { shortCode } = req.params;
  const data = await analytics.getShortUrlClicksByDay(user, shortCode);
  successResponse({ res, data });
};

/**
 * Devuelve las métricas globales del usuario autenticado.
 * @param req - Request con el usuario autenticado
 * @param res - Response con las métricas globales
 */
export const getUserGlobalMetrics = async (req: IJwtRequest, res: Response) => {
  const user = req.user;
  if (!user?.id) throw new UnauthorizedError('No authorization token provided');
  const data = await analytics.getUserGlobalMetrics(user);
  successResponse({ res, data });
};
