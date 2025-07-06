import ShortURLModel from '@/models/shortURL.model';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

/**
 * Genera un shortURL único que no exista en la base de datos.
 * @param length Longitud del ID generado (por defecto 5)
 * @param maxAttempts Máximo de intentos para evitar bucle infinito (por defecto 20)
 * @returns {Promise<string>} Un identificador único para la URL corta.
 * @throws {Error} Si no se puede generar un ID único tras varios intentos.
 */
// const generateUniqueShortUR2L = async (
//   length = 5,
//   maxAttempts = 30
// ): Promise<string> => {
//   for (let attempt = 0; attempt < maxAttempts; attempt++) {
//     const uniqueShortURL = nanoid(length);
//     const exists = await ShortURLModel.exists({ shortURL: uniqueShortURL });
//     if (!exists) return uniqueShortURL;
//   }
//   throw new Error('No se pudo generar un shortURL único tras varios intentos');
// };

const createShortURL = async (
  data: Record<string, unknown>,
  maxAttempts = 5,
  length = 3
): Promise<Document> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const timestamp = Date.now().toString(36).slice(-2); // 2 chars
    const random = nanoid(length); // 3 chars
    const shortURL = random + timestamp; // 5 chars total

    try {
      const newURL = await ShortURLModel.create({
        ...data,
        shortURL,
        totalClicks: 0
      });
      return newURL;
    } catch (error) {
      if (isDuplicateError(error)) {
        continue;
      }
      throw error;
    }
  }
  throw new Error('No se pudo generar un shortURL único tras varios intentos');
};

// Helper para detectar errores de duplicado
export function isDuplicateError(
  error: unknown
): error is { code?: number; name?: string; message?: string } {
  if (typeof error !== 'object' || error === null) return false;
  const err = error as { code?: number; name?: string; message?: string };
  return (
    err.code === 11000 ||
    err.name === 'MongoError' ||
    (typeof err.message === 'string' && /duplicate key/i.test(err.message))
  );
}

const SHORT_ID_LENGTH = 6;
export const generateUniqueShortURL = () => {
  const timestamp = Date.now().toString(36).slice(-2);
  return nanoid(SHORT_ID_LENGTH - 2) + timestamp;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default createShortURL;
