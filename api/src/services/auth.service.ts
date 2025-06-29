/**
 * Servicio de autenticación. Gestiona el registro, login y validación de usuarios.
 * @module services/auth.service
 */

import { CustomJwtPayload } from '@/interfaces/customJwt.interface';
import { IUser } from '@/interfaces/user.interface';
import UserModel from '@/models/user.model';
import { UnauthorizedError, ValidationError } from '@/utils/errors';
import token from '@/utils/token';
import bcrypt from 'bcryptjs';

/**
 * Registra un nuevo usuario y devuelve el token y el nombre de usuario.
 * @param {IUser} param0 - Objeto con user, name y password.
 * @returns {Promise<{ token: string, user: string }>} Token y usuario registrado.
 * @throws {ValidationError} Si faltan datos.
 */
const register = async ({ user, name, password }: IUser) => {
  if (!user || !name || !password) {
    throw new ValidationError('User, name and password are required');
  }
  const saltRounds = 10;
  const passwordHash: string = await bcrypt.hash(password, saltRounds);
  const userCreated = new UserModel({
    user,
    name,
    passwordHash
  });
  const savedUser = await userCreated.save();
  const tokenGen = token.generateToken(
    savedUser.user,
    savedUser._id.toString()
  );
  return { token: tokenGen, user: savedUser.user };
};

/**
 * Devuelve los datos y URLs del usuario autenticado.
 * @param {CustomJwtPayload} user - Usuario autenticado extraído del token.
 * @returns {Promise<any>} Usuario con sus URLs.
 * @throws {UnauthorizedError} Si no hay usuario.
 */
const getPersonal = async (user: CustomJwtPayload) => {
  if (!user) {
    throw new UnauthorizedError('No user id provided');
  }
  return await UserModel.findById(user.id).populate('shortURLs');
};

/**
 * Inicia sesión y devuelve el token y el nombre de usuario.
 * @param {IUser} param0 - Objeto con user y password.
 * @returns {Promise<{ token: string, user: string }>} Token y usuario autenticado.
 * @throws {ValidationError} Si faltan datos.
 * @throws {UnauthorizedError} Si el usuario o la contraseña no son válidos.
 */
const login = async ({ user, password }: IUser) => {
  if (!user || !password) {
    throw new ValidationError('User and password are required');
  }
  const userFind = await UserModel.findOne({ user });
  const passwordCorrect =
    userFind === null
      ? false
      : await bcrypt.compare(userFind.passwordHash as string, password);
  if (!(userFind && passwordCorrect)) {
    throw new UnauthorizedError('Invalid username or password');
  }
  const tokenGen = token.generateToken(userFind.user, userFind._id.toString());
  return { token: tokenGen, user: userFind.user };
};

export default { register, getPersonal, login };
