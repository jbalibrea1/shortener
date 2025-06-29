/**
 * Controlador de usuarios. Gestiona el registro, login y obtención de datos de usuario.
 * @module controllers/userController
 */

import { IUser } from '@/interfaces/user.interface';
import auth from '@/services/auth.service';
import { UnauthorizedError } from '@/utils/errors';
import token from '@/utils/token';
import { Request, Response } from 'express';

/**
 * Inicia sesión de usuario y devuelve el token JWT.
 * @route POST /api/auth
 */
const login = async (req: Request<unknown, unknown, IUser>, res: Response) => {
  const { user, password } = req.body;
  const userAuth = await auth.login({ user, password });
  res.status(200).json({ token: userAuth.token, user: userAuth.user });
};

/**
 * Registra un nuevo usuario.
 * @route POST /api/auth/register
 */
const saveUser = async (
  req: Request<unknown, unknown, IUser>,
  res: Response
) => {
  const { user, name, password } = req.body;
  const savedUser = await auth.register({ user, name, password });
  res.status(201).json(savedUser);
};

/**
 * Devuelve los datos y URLs del usuario autenticado.
 * @route GET /api/auth
 */
const getUser = async (req: Request, res: Response) => {
  const user = token.extractToken(req);
  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }
  const userUrls = await auth.getPersonal(user);
  res.json(userUrls);
};

export default { saveUser, getUser, login };
