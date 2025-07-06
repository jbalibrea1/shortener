import { IJwtRequest, IUser } from '@/interfaces';
import auth from '@/services/auth.service';
import { UnauthorizedError } from '@/utils/errors';
import { successResponse } from '@/utils/succesResponse';
import { Request, Response } from 'express';

/**
 * Controlador de usuarios. Gestiona el registro, login y obtención de datos de usuario.
 * @module controllers/userController
 */

/**
 * Inicia sesión de usuario y devuelve el token JWT.
 * @route POST /api/auth
 */
const login = async (req: Request<unknown, unknown, IUser>, res: Response) => {
  const { username, password } = req.body;
  console.log(username);
  const userAuth = await auth.login({ username, password });
  successResponse(
    res,
    200,
    {
      token: String(userAuth.token),
      username: String(userAuth.username)
    },
    'Login correcto'
  );
};

/**
 * Registra un nuevo usuario.
 * @route POST /api/auth/register
 */
const saveUser = async (
  req: Request<unknown, unknown, IUser>,
  res: Response
) => {
  const { username, password } = req.body;
  const savedUser = await auth.register({ username, password });
  successResponse(res, 201, savedUser, 'Usuario registrado correctamente');
};

/**
 * Devuelve los datos y URLs del usuario autenticado.
 * @route GET /api/auth
 */
const getUser = async (req: IJwtRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }
  const userUrls = await auth.getPersonalInfo(user);
  successResponse(
    res,
    200,
    userUrls,
    'Datos de usuario obtenidos correctamente'
  );
};

export default { saveUser, getUser, login };
