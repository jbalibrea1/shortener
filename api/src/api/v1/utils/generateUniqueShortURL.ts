import { nanoid } from 'nanoid';

// Helper para detectar errores de duplicado
export function isDuplicateError(
  error: unknown,
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
export const generateUniquerShortCode = () => {
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
