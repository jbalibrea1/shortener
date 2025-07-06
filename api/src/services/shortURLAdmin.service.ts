import { IShortURL } from '@/interfaces';
import ShortURLModel from '@/models/shortURL.model';
import UserModel from '@/models/user.model';

/**
 * Obtiene todos los registros de URLs acortadas.
 * @returns {Promise<ShortURL[]>} Lista de URLs acortadas.
 */
const getAllShortURLs = async (): Promise<IShortURL[]> => {
  return await ShortURLModel.find({});
};

const promoteUserToAdmin = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) return null;

  user.role = 'admin';
  await user.save();

  return { userId: user._id, newRole: user.role };
};

export const demoteUserToAdmin = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) return null;

  user.role = 'user';
  await user.save();

  return { userId: user._id, newRole: user.role };
};

export default {
  getAllShortURLs,
  promoteUserToAdmin,
  demoteUserToAdmin
};
