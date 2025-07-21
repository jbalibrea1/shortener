/**
 * Controlador de usuarios. Gestiona el registro, login y obtención de datos de usuario.
 * @module controllers/userController
 */

import type { Request, Response } from 'express';
import type { IJwtRequest, IUser } from '@/api/v1/interfaces';
import auth from '@/api/v1/services/auth.service';
import { UnauthorizedError } from '@/api/v1/utils/errors';
import { successResponse } from '@/api/v1/utils/responses';
import token from '../utils/token';

/**
 * Inicia sesión de usuario y devuelve el token JWT.
 * @route POST /api/auth
 */
export const login = async (
  req: Request<unknown, unknown, IUser>,
  res: Response,
) => {
  const { username, password } = req.body;
  const authenticatedUser = await auth.login({ username, password });
  successResponse({ res, data: authenticatedUser, msg: 'Login correcto' });
};

/**
 * Registra un nuevo usuario.
 * @route POST /api/auth/register
 */
export const saveUser = async (
  req: Request<unknown, unknown, IUser>,
  res: Response,
) => {
  const { username, password, name, email } = req.body;
  const newUser = await auth.register({ username, password, name, email });
  successResponse({
    res,
    status: 201,
    data: newUser,
    msg: 'Usuario registrado correctamente',
  });
};

/**
 * Devuelve los datos y URLs del usuario autenticado.
 * @route GET /api/auth
 */
export const getUser = async (req: IJwtRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    throw new UnauthorizedError('Unauthorized');
  }
  const userUrls = await auth.getPersonalInfo(user);
  successResponse({
    res,
    data: userUrls,
    msg: 'Datos de usuario obtenidos correctamente',
  });
};

// TODO: Remove refresh token
export const logout = async (req: IJwtRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    throw new UnauthorizedError('No authorization token provided');
  }

  await auth.logout(user.id);
  successResponse({ res, msg: 'Logout exitoso' });
};

/**
 * Devuelve el token de refresco del usuario autenticado.
 * @route GET /api/auth/refresh
 */
export const refreshToken = async (
  req: Request<unknown, unknown, { refreshToken: string }>,
  res: Response,
) => {
  const { refreshToken } = req.body;
  if (!refreshToken || typeof refreshToken !== 'string') {
    throw new UnauthorizedError('No refresh token provided');
  }
  const payload = token.verifyRefreshToken(refreshToken);
  if (!payload || !payload.id) {
    throw new UnauthorizedError('Invalid refresh token');
  }
  const data = await auth.refreshToken(payload.id);

  successResponse({ res, data, msg: 'Token refrescado' });
};
