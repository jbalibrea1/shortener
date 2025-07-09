import { IShortURL } from '@/api/v1/interfaces';
import { ShortURLModel, UserModel } from '@/api/v1/models';
import {
  ConflictError,
  NotFoundError,
  ValidationError
} from '@/api/v1/utils/errors';
import logger from '@/logger';

/**
 * Obtiene todos los registros de URLs acortadas.
 * @returns {Promise<ShortURL[]>} Lista de URLs acortadas.
 */
const getAllShortURLs = async (): Promise<IShortURL[]> => {
  return await ShortURLModel.find({});
};

const promoteUserToAdmin = async (username: string) => {
  if (!username || typeof username !== 'string') {
    throw new ValidationError('Nombre de usuario válido requerido');
  }
  const user = await UserModel.findOne({ username });
  if (!user) throw new NotFoundError('Usuario no encontrado');
  if (user.role === 'admin')
    throw new ConflictError('El usuario ya tiene rol de administrador');

  const previousRole = user.role;
  user.role = 'admin';

  try {
    await user.save();
    logger.info(
      `Usuario ${user.username} promovido de ${previousRole} a admin`
    );
    // await sendAdminNotification({
    //   userId: user._id,
    //   email: user.email,
    //   previousRole,
    //   newRole: 'admin'
    // });

    return {
      username: user.username,
      newRole: user.role,
      previousRole,
      updatedAt: user.updatedAt
    };
  } catch (error) {
    logger.error(`Error al promover usuario a admin: ${error}`);
    throw new Error('Error interno al actualizar el usuario');
  }
};

export const demoteUserToAdmin = async (username: string) => {
  if (!username || typeof username !== 'string') {
    throw new ValidationError('Nombre de usuario válido requerido');
  }
  const user = await UserModel.findOne({ username });
  if (!user) throw new NotFoundError('Usuario no encontrado');
  if (user.role !== 'admin')
    throw new ConflictError('El usuario no es administrador');

  const previousRole = user.role;
  user.role = 'user';
  try {
    await user.save();
    logger.info(`Usuario ${user.username} demoteado de ${previousRole} a user`);
    return {
      username: user.username,
      newRole: user.role,
      previousRole,
      updatedAt: user.updatedAt
    };
  } catch (error) {
    logger.error(`Error al demotear usuario a user: ${error}`);
    throw new Error('Error interno al actualizar el usuario');
  }
};

export default {
  getAllShortURLs,
  promoteUserToAdmin,
  demoteUserToAdmin
};
