import { IJwtRequest } from '@/interfaces';
import analyticsService from '@/services/analytics.service';
import { UnauthorizedError } from '@/utils/errors';
import { successResponse } from '@/utils/succesResponse';
import { Response } from 'express';

/**
 * Devuelve todas las URLs del usuario autenticado con analíticas.
 */
const getUserAnalytics = async (req: IJwtRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    throw new UnauthorizedError('No authorization token provided');
  }
  const analytics = await analyticsService.getUserAnalytics(user);
  successResponse(res, 200, analytics);
};

/**
 * Devuelve la analítica de una shortUrl concreta del usuario autenticado.
 */
const getShortUrlAnalytics = async (req: IJwtRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    throw new UnauthorizedError('No authorization token provided');
  }
  const { shortUrl } = req.params;
  const analytics = await analyticsService.getShortUrlAnalytics(user, shortUrl);
  successResponse(res, 200, analytics);
};

/**
 * Devuelve los clics por día sumados de todas las URLs del usuario autenticado.
 */
const getUserClicksByDay = async (req: IJwtRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    throw new UnauthorizedError('No authorization token provided');
  }
  const clicksByDay = await analyticsService.getUserClicksByDay(user);
  successResponse(res, 200, clicksByDay);
};

export default { getUserAnalytics, getShortUrlAnalytics, getUserClicksByDay };
