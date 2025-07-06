import { CustomJwtPayload, IShortURL, NewShortURLEntry } from '@/interfaces';
import AnalyticsModel from '@/models/analytics.model';
import ShortURLModel from '@/models/shortURL.model';
import UserModel from '@/models/user.model';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError
} from '@/utils/errors';
import {
  generateUniqueShortURL,
  isDuplicateError
} from '@/utils/generateUniqueShortURL';
import { Request } from 'express';
import mongoose from 'mongoose';

const getAllShortURLsFromUser = async (
  user: CustomJwtPayload
): Promise<IShortURL[]> => {
  if (!user || !user.id) {
    throw new UnauthorizedError('No user id provided');
  }
  return await ShortURLModel.find({ user: user.id });
};

/**
 * Crea una nueva URL acortada y la asocia a un usuario si existe.
 * @param {string} url - La URL original a acortar.
 * @param {CustomJwtPayload | null} user - El usuario autenticado, si existe.
 * @returns {Promise<any>} El documento guardado en la base de datos.
 * @throws {Error} Si la URL no es válida.
 */

const MAX_ATTEMPTS = 3;
export const createShortURL = async (
  urlData: NewShortURLEntry,
  user?: CustomJwtPayload
) => {
  if (!urlData?.url || typeof urlData.url !== 'string') {
    throw new ValidationError('URL válida es requerida');
  }

  const commonData = {
    ...urlData,
    user: user?.id || null,
    totalClicks: 0
  };

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const shortURL = generateUniqueShortURL();
    // Iniciar sesión de Mongoose para transacciones
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Crear la URL corta
      const [savedEntry] = await ShortURLModel.create(
        [
          {
            ...commonData,
            shortURL
          }
        ],
        { session }
      );

      // 2. Actualizar usuario en caso de existir
      if (user?.id) {
        await UserModel.findByIdAndUpdate(
          user.id,
          { $addToSet: { shortURLs: savedEntry._id } },
          { session }
        );
      }

      await session.commitTransaction();
      return savedEntry;
    } catch (error) {
      await session.abortTransaction();

      // Si no es error de duplicado, relanzar
      if (!isDuplicateError(error)) throw error;

      // Esperar exponencialmente entre intentos
      if (attempt < MAX_ATTEMPTS - 1) {
        await new Promise((resolve) => setTimeout(resolve, 10 * 2 ** attempt));
      }
    } finally {
      await session.endSession();
    }
  }

  throw new Error(
    `No se pudo generar URL única después de ${MAX_ATTEMPTS} intentos`
  );
};

/**
 * Obtiene información de una shortURL, incluyendo el usuario.
 * @param {string} shortURL - El identificador de la URL corta.
 * @returns {Promise<{ entry: any, user: string | null }>} Información de la URL y el usuario.
 * @throws {Error} Si no se encuentra la URL corta.
 */
const getShortURLInfo = async (shortURL: string) => {
  const entry = await ShortURLModel.findOne({ shortURL });
  if (!entry) {
    throw new Error(`Short URL not found for ${shortURL}`);
  }
  const findUser = entry.user ? await UserModel.findById(entry.user) : null;
  return { entry, user: findUser?.username ?? null };
};

/**
 * Obtiene la URL original y suma un click.
 * @param {string} shortURL - El identificador de la URL corta.
 * @returns {Promise<string|null>} La URL original o null si no se encuentra.
 */
const resolveShortURL = async (shortURL: string, req?: Request) => {
  const entry = await ShortURLModel.findOne({ shortURL });
  if (!entry) {
    return null;
  }
  entry.totalClicks += 1;
  await entry.save();

  if (req) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      req.ip;
    await AnalyticsModel.create({
      shortUrl: entry._id,
      ipAddress: ip || null
    });
  }
  return entry.url;
};

/**
 * Elimina una shortURL asociada a un usuario autenticado.
 * @param {string} shortURL - El identificador de la URL corta.
 * @param {CustomJwtPayload | null} user - El usuario autenticado.
 * @returns {Promise<any>} El documento eliminado.
 * @throws {UnauthorizedError} Si no hay usuario autenticado.
 * @throws {ValidationError} Si el parámetro es inválido.
 * @throws {NotFoundError} Si la URL no existe o no pertenece al usuario.
 */
const deleteShortURL = async (
  shortURL: string,
  user: CustomJwtPayload | null
) => {
  if (!user || !user.id) {
    throw new UnauthorizedError('No authorization token provided');
  }

  if (!shortURL || typeof shortURL !== 'string') {
    throw new ValidationError('Short URL is required and must be a string');
  }

  const entry = await ShortURLModel.findOne({ shortURL });
  if (!entry) {
    throw new NotFoundError(`Short URL not found for ${shortURL}`);
  }
  if (!entry.user || entry.user.toString() !== user.id) {
    throw new UnauthorizedError(
      'You do not have permission to delete this URL'
    );
  }

  const deletedEntry = await ShortURLModel.findOneAndDelete({
    shortURL,
    user: user.id
  });

  // Quita la referencia en el usuario
  await UserModel.findByIdAndUpdate(user.id, {
    $pull: { shortURLs: entry._id }
  });

  return deletedEntry;
};

export default {
  createShortURL,
  resolveShortURL,
  deleteShortURL,
  getShortURLInfo,
  getAllShortURLsFromUser
};
