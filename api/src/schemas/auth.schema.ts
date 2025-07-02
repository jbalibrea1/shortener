import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'Usuario requerido'),
  password: z.string().min(6, 'Contraseña mínima 6 caracteres')
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Usuario requerido'),
  name: z.string().min(2, 'Nombre requerido'),
  password: z.string().min(6, 'Contraseña mínima 6 caracteres')
});
