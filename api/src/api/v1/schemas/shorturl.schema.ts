import { z } from 'zod';

export const shortUrlBodySchema = z.object({
  url: z.string().url({ message: 'Debe ser una URL válida' })
});

// TODO: Revisar si es necesario el min y max
export const shortUrlParamSchema = z.object({
  shortUrl: z
    .string()
    .min(4, 'El shortURL debe tener al menos 4 caracteres')
    .max(12, 'El shortURL debe tener como máximo 12 caracteres')
});
