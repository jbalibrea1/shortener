import z from 'zod';
// TODO: add zod schema, unificar con el de api?

export const loginSchema = z.object({
  username: z.string().min(3, 'Nombre de usuario mínimo 3 caracteres'),
  password: z.string().min(6, 'Contraseña mínima 6 caracteres')
});
export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z.string().min(3, 'Nombre de usuario mínimo 3 caracteres'),
    password: z.string().min(6, 'Contraseña mínima 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
