/**
 * Servicio de autenticación. Gestiona el registro, login y validación de usuarios.
 * @module services/auth.service
 */

import { CustomJwtPayload } from '@/interfaces';
import { IUser } from '@/interfaces/user.interface';
import UserModel from '@/models/user.model';
import { UnauthorizedError, ValidationError } from '@/utils/errors';
import token from '@/utils/token';
import bcrypt from 'bcryptjs';

/**
 * Registra un nuevo usuario y devuelve el token y el nombre de usuario.
 * @param {IUser} param0 - Objeto con username, name y password.
 * @returns {Promise<{ token: string, username: string }>} Token y usuario registrado.
 * @throws {ValidationError} Si faltan datos.
 */
const register = async ({ username, name, password }: IUser) => {
  if (!username || !name || !password) {
    throw new ValidationError('Username, name and password are required');
  }
  const saltRounds = 10;
  const passwordHash: string = await bcrypt.hash(password, saltRounds);
  const userCreated = new UserModel({
    username,
    name,
    passwordHash
  });
  const savedUser = await userCreated.save();
  const tokenGen = token.generateToken(
    savedUser.username,
    savedUser._id.toString(),
    savedUser.role
  );
  return { token: tokenGen, username: savedUser.username };
};

/**
 * Devuelve los datos y URLs del usuario autenticado.
 * @param {CustomJwtPayload} user - Usuario autenticado extraído del token.
 * @returns {Promise<any>} Usuario con sus URLs.
 * @throws {UnauthorizedError} Si no hay usuario.
 */
const getPersonalInfo = async (user: CustomJwtPayload) => {
  if (!user) {
    throw new UnauthorizedError('No user id provided');
  }
  return await UserModel.findById(user.id).populate('shortURLs');
};

/**
 * Inicia sesión y devuelve el token y el nombre de usuario.
 * @param {IUser} param0 - Objeto con username y password.
 * @returns {Promise<{ token: string, username: string }>} Token y usuario autenticado.
 * @throws {ValidationError} Si faltan datos.
 * @throws {UnauthorizedError} Si el usuario o la contraseña no son válidos.
 */
const login = async ({ username, password }: IUser) => {
  if (!username || !password) {
    throw new ValidationError('Username and password are required');
  }
  const userFind = await UserModel.findOne({ username });
  const passwordCorrect =
    userFind === null
      ? false
      : await bcrypt.compare(password, userFind.passwordHash as string);
  if (!(userFind && passwordCorrect)) {
    throw new UnauthorizedError('Invalid username or password');
  }
  const tokenGen = token.generateToken(
    userFind.username,
    userFind._id.toString(),
    userFind.role
  );
  return { token: tokenGen, username: userFind.username };
};

export default { register, getPersonalInfo, login };
