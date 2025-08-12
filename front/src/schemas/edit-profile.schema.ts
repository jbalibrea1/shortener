import { z } from 'zod';

export const editProfileSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type EditProfileSchemaType = z.infer<typeof editProfileSchema>;
