import { CustomJwtPayload, IShortURL } from '@/interfaces';
import ShortURLModel from '@/models/shortURL.model';
import UserModel from '@/models/user.model';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError
} from '@/utils/errors';
import generateRandom from '@/utils/generateRandom';

/**
 * Obtiene todos los registros de URLs acortadas.
 * @returns {Promise<ShortURL[]>} Lista de URLs acortadas.
 */
const getAllShortURLs = async (): Promise<IShortURL[]> => {
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
const createShortURL = async (
  urlData: Record<string, unknown>,
  user: CustomJwtPayload | null
) => {
  if (!urlData || typeof urlData.url !== 'string') {
    throw new ValidationError('URL is required');
  }

  // Genera shortURL único
  const uniqueShortURL = await generateUniqueShortURL();

  // Crea la entrada + metadatos
  const newEntry = new ShortURLModel({
    ...urlData,
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
  const findUser = entry.user ? await UserModel.findById(entry.user) : null;
  return { entry, user: findUser?.username ?? null };
};

/**
 * Obtiene la URL original y suma un click.
 * @param {string} shortURL - El identificador de la URL corta.
 * @returns {Promise<string|null>} La URL original o null si no se encuentra.
 */
const resolveShortURL = async (shortURL: string) => {
  const entry = await ShortURLModel.findOne({ shortURL });
  if (!entry) {
    return null;
  }
  entry.totalClicks += 1;
  await entry.save();
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
  getAllShortURLs,
  createShortURL,
  resolveShortURL,
  deleteShortURL,
  getShortURLInfo
};
