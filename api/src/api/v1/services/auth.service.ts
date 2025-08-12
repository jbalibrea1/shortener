/**
 * Servicio de autenticación. Gestiona el registro, login y validación de usuarios.
 * @module services/auth.service
 */

import bcrypt from 'bcryptjs';
import type { CustomJwtPayload } from '@/api/v1/interfaces';
import type { IUser } from '@/api/v1/interfaces/user.interface';
import { UserModel } from '@/api/v1/models';
import { UnauthorizedError, ValidationError } from '@/api/v1/utils/errors';
import token from '@/api/v1/utils/token';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiredAt: Date;
  username: string;
  name?: string;
  email?: string;
  role?: string;
}

/**
 * Registra un nuevo usuario y devuelve el token y el nombre de usuario.
 * @param {IUser} data - Objeto con username, password, name y email.
 * @returns {Promise<AuthResponse>} Token y usuario registrado.
 * @throws {ValidationError} Si faltan datos.
 */
const register = async (data: IUser): Promise<AuthResponse> => {
  const { username, password, name, email } = data;
  if (!username || !password) {
    throw new ValidationError('Username and password are required');
  }

  const existingUser = await UserModel.findOne({ username }).collation({
    locale: 'en',
    strength: 1,
  });
  if (existingUser) {
    throw new ValidationError('Username already exists');
  }

  const saltRounds = 10;
  const passwordHash: string = await bcrypt.hash(password, saltRounds);

  const userCreated = new UserModel({
    username,
    passwordHash,
    name,
    email,
  });

  const savedUser = await userCreated.save();
  const { accessToken, refreshToken, expiredAt } = token.generateToken(
    savedUser.username,
    savedUser._id.toString(),
    savedUser.role // role default is 'user'
  );

  return {
    accessToken,
    refreshToken,
    expiredAt,
    username: savedUser.username,
    ...(savedUser.name && { name: savedUser.name }),
    ...(savedUser.email && { email: savedUser.email }),
    ...(savedUser.role && { role: savedUser.role }),
  };
};

/**
 * Inicia sesión y devuelve el token y el nombre de usuario.
 * @param {Pick<IUser, 'username' | 'password'>} data - Objeto con username y password.
 * @returns {Promise<AuthResponse>} Token y usuario autenticado.
 * @throws {ValidationError} Si faltan datos.
 * @throws {UnauthorizedError} Si el usuario o la contraseña no son válidos.
 */
const login = async (
  data: Pick<IUser, 'username' | 'password'>
): Promise<AuthResponse> => {
  const { username, password } = data;
  if (!username || !password) {
    throw new ValidationError('Username and password are required');
  }

  const userFind = await UserModel.findOne({ username }).collation({
    locale: 'en',
    strength: 2,
  });

  const passwordCorrect =
    userFind === null
      ? false
      : await bcrypt.compare(password, userFind.passwordHash);

  if (!(userFind && passwordCorrect)) {
    throw new UnauthorizedError('Invalid username or password');
  }

  const { accessToken, refreshToken, expiredAt } = token.generateToken(
    userFind.username,
    userFind._id.toString(),
    userFind.role
  );

  return {
    accessToken,
    refreshToken,
    expiredAt,
    username: userFind.username,
    ...(userFind.name && { name: userFind.name }),
    ...(userFind.email && { email: userFind.email }),
    ...(userFind.role && { role: userFind.role }),
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

// TODO: Remove refresh token
const logout = (userId: string): Promise<void> => {
  if (!userId) {
    throw new UnauthorizedError('No user id provided');
  }
  // invalidar el token del usuario, por ejemplo, eliminando su sesión doe la base de datos o marcando el token como inválido
  return Promise.resolve();
};

const refreshToken = async (userId: string): Promise<AuthResponse> => {
  if (!userId) {
    throw new UnauthorizedError('No user id provided');
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  const { accessToken, refreshToken, expiredAt } = token.generateToken(
    user.username,
    user._id.toString(),
    user.role
  );

  return {
    accessToken,
    refreshToken,
    expiredAt,
    username: user.username,
    ...(user.name && { name: user.name }),
    ...(user.email && { email: user.email }),
    ...(user.role && { role: user.role }),
  };
};

const updateProfile = async (
  userId: string,
  data: Partial<IUser>
): Promise<ReturnType<typeof UserModel.findById>> => {
  if (!userId) {
    throw new UnauthorizedError('No user id provided');
  }
  if (data.password) {
    const saltRounds = 10;
    data.passwordHash = await bcrypt.hash(data.password, saltRounds);
    delete data.password;
  }
  return await UserModel.findByIdAndUpdate(userId, data, { new: true });
};

export default {
  register,
  login,
  getPersonalInfo,
  logout,
  refreshToken,
  updateProfile,
};
