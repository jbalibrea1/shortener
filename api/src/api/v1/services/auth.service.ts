/**
 * Servicio de autenticación. Gestiona el registro, login y validación de usuarios.
 * @module services/auth.service
 */

import { CustomJwtPayload } from '@/api/v1/interfaces';
import { IUser } from '@/api/v1/interfaces/user.interface';
import { UserModel } from '@/api/v1/models';
import { UnauthorizedError, ValidationError } from '@/api/v1/utils/errors';
import token from '@/api/v1/utils/token';
import bcrypt from 'bcryptjs';

/**
 * Registra un nuevo usuario y devuelve el token y el nombre de usuario.
 * @param {IUser} data - Objeto con username, password, name y email.
 * @returns {Promise<{ token: string, username: string }>} Token y usuario registrado.
 * @throws {ValidationError} Si faltan datos.
 */
const register = async (
  data: IUser
): Promise<{
  token: string;
  username: string;
  name?: string;
  email?: string;
}> => {
  const { username, password, name, email } = data;
  if (!username || !password) {
    throw new ValidationError('Username and password are required');
  }
  const saltRounds = 10;
  const passwordHash: string = await bcrypt.hash(password, saltRounds);

  const userCreated = new UserModel({
    username,
    passwordHash,
    name,
    email
  });

  const savedUser = await userCreated.save();
  const tokenGen = token.generateToken(
    savedUser.username,
    savedUser._id.toString(),
    savedUser.role // role default is 'user'
  );

  return {
    token: tokenGen,
    username: savedUser.username,
    ...(savedUser.name && { name: savedUser.name }),
    ...(savedUser.email && { email: savedUser.email }),
    ...(savedUser.role && { role: savedUser.role })
  };
};

/**
 * Inicia sesión y devuelve el token y el nombre de usuario.
 * @param {Pick<IUser, 'username' | 'password'>} data - Objeto con username y password.
 * @returns {Promise<{ token: string, username: string }>} Token y usuario autenticado.
 * @throws {ValidationError} Si faltan datos.
 * @throws {UnauthorizedError} Si el usuario o la contraseña no son válidos.
 */
const login = async (
  data: Pick<IUser, 'username' | 'password'>
): Promise<{
  token: string;
  username: string;
  name?: string;
  email?: string;
}> => {
  const { username, password } = data;
  if (!username || !password) {
    throw new ValidationError('Username and password are required');
  }
  const userFind = await UserModel.findOne({ username });
  const passwordCorrect =
    userFind === null
      ? false
      : await bcrypt.compare(password, userFind.passwordHash);
  if (!(userFind && passwordCorrect)) {
    throw new UnauthorizedError('Invalid username or password');
  }
  const tokenGen = token.generateToken(
    userFind.username,
    userFind._id.toString(),
    userFind.role
  );
  return {
    token: tokenGen,
    username: userFind.username,
    ...(userFind.name && { name: userFind.name }),
    ...(userFind.email && { email: userFind.email }),
    ...(userFind.role && { role: userFind.role })
  };
};

/**
 * Devuelve los datos y URLs del usuario autenticado.
 * @param {CustomJwtPayload} user - Usuario autenticado extraído del token.
 * @returns {Promise<ReturnType<typeof UserModel.findById>>} Datos del usuario con sus URLs acortadas.
 * @throws {UnauthorizedError} Si no hay usuario.
 */
const getPersonalInfo = async (
  user: CustomJwtPayload
): Promise<ReturnType<typeof UserModel.findById>> => {
  if (!user) {
    throw new UnauthorizedError('No user id provided');
  }
  return await UserModel.findById(user.id);
};

export default { register, login, getPersonalInfo };
