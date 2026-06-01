import * as z from 'zod';

import { CATEGORY_COLORS } from './types';

const categoryColorValues = Object.values(CATEGORY_COLORS) as [string, ...string[]];

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  type: z.enum(['income', 'expense']),
  color: z.enum(categoryColorValues),
});

export const transactionSchema = z.object({
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  type: z.enum(['income', 'expense']),
  description: z.string().trim().min(1, 'La descripción es obligatoria'),
  date: z.string().trim().min(1, 'La fecha es obligatoria'),
  categoryId: z.string().trim().min(1, 'La categoría es obligatoria'),
  photoUri: z.string().trim().min(1).optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El email es obligatorio')
    .email('El email no es válido'),
  password: z.string().trim().min(1, 'La contraseña es obligatoria'),
});
