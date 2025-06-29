/**
 * Servicio de URLs acortadas. Gestiona la creación, consulta, redirección y eliminación de shortURLs.
 * @module services/shortURL.service
 */

import { CustomJwtPayload } from '@/interfaces/customJwt.interface';
import { ShortURL } from '@/interfaces/shortURL.interface';
import ShortURLModel from '@/models/shortURL.model';
import UserModel from '@/models/user.model';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError
} from '@/utils/errors';
import generateRandom from '@/utils/generateRandom';
import parsedURL from '@/utils/parsedURL';

/**
 * Obtiene todos los registros de URLs acortadas.
 * @returns {Promise<ShortURL[]>} Lista de URLs acortadas.
 */
const getAllShortURLs = async (): Promise<ShortURL[]> => {
  return await ShortURLModel.find({});
};

/**
 * Genera un shortURL único que no exista en la base de datos.
 * @returns {Promise<string>} Un identificador único para la URL corta.
 */
const generateUniqueShortURL = async (): Promise<string> => {
  let uniqueShortURL = generateRandom();
  while (await ShortURLModel.findOne({ shortURL: uniqueShortURL })) {
    uniqueShortURL = generateRandom();
  }
  return uniqueShortURL;
};

/**
 * Crea una nueva URL acortada y la asocia a un usuario si existe.
 * @param {string} url - La URL original a acortar.
 * @param {CustomJwtPayload | null} user - El usuario autenticado, si existe.
 * @returns {Promise<any>} El documento guardado en la base de datos.
 * @throws {Error} Si la URL no es válida.
 */
const createShortURL = async (url: string, user: CustomJwtPayload | null) => {
  if (!url || typeof url !== 'string') {
    throw new ValidationError('URL is required');
  }

  // Valida y agrega metadatos
  const newShortUrlEntry = await parsedURL({ url });

  // Genera shortURL único
  const uniqueShortURL = await generateUniqueShortURL();

  // Crea la entrada
  const newEntry = new ShortURLModel({
    ...newShortUrlEntry,
    shortURL: uniqueShortURL,
    user: user?.id ?? null
  });

  const savedEntry = await newEntry.save();

  // Asocia la URL al usuario si está autenticado
  if (user?.id) {
    await UserModel.findByIdAndUpdate(user.id, {
      $push: { shortURLs: savedEntry._id }
    });
  }

  return savedEntry;
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
  const fullUser = entry.user ? await UserModel.findById(entry.user) : null;
  return { entry, user: fullUser?.user ?? null };
};

/**
 * Obtiene la URL original y suma un click.
 * @param {string} shortURL - El identificador de la URL corta.
 * @returns {Promise<string>} La URL original.
 * @throws {Error} Si no se encuentra la URL corta.
 */
const resolveShortURL = async (shortURL: string) => {
  const entry = await ShortURLModel.findOne({ shortURL });
  if (!entry) {
    throw new Error(`Short URL not found for ${shortURL}`);
  }
  entry.totalClicks += 1;
  await entry.save();
  return entry.url;
};

/**
 * Elimina una shortURL asociada a un usuario.
 * @param {string} shortURL - El identificador de la URL corta.
 * @param {CustomJwtPayload | null} user - El usuario autenticado.
 * @returns {Promise<any>} El documento eliminado.
 * @throws {Error} Si no hay usuario autenticado o no se encuentra la URL.
 */
const deleteShortURL = async (
  shortURL: string,
  user: CustomJwtPayload | null
) => {
  if (!user) {
    throw new UnauthorizedError('No authorization token provided');
  }

  if (!shortURL) {
    throw new ValidationError('Short URL is required');
  }

  const deletedEntry = await ShortURLModel.findOneAndDelete({
    shortURL,
    user: user.id
  });

  if (!deletedEntry) {
    throw new NotFoundError(`Short URL not found for ${shortURL}`);
  }

  await UserModel.findByIdAndUpdate(user.id, {
    $pull: { shortURLs: deletedEntry._id }
  });

  return deletedEntry;
};

export default {
  getAllShortURLs,
  createShortURL,
  resolveShortURL,
  deleteShortURL,
  getShortURLInfo
};
