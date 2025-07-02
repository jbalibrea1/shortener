import { z } from 'zod';

export const shortUrlBodySchema = z.object({
  url: z.string().url({ message: 'Debe ser una URL válida' })
});

export const shortUrlParamSchema = z.object({
  shortUrl: z
    .string()
    .min(4, 'El shortURL debe tener al menos 4 caracteres')
    .max(16, 'El shortURL es demasiado largo')
});
