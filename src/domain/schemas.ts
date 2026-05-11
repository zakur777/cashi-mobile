import * as z from 'zod';

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
});

export const transactionSchema = z.object({
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  type: z.enum(['income', 'expense']),
  description: z.string().trim().min(1, 'La descripción es obligatoria'),
  date: z.string().trim().min(1, 'La fecha es obligatoria'),
  categoryId: z.string().trim().min(1, 'La categoría es obligatoria'),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'El usuario es obligatorio'),
  password: z.string().trim().min(1, 'La contraseña es obligatoria'),
});
