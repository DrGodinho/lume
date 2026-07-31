import { z } from 'zod';
import { LEAD_STAGES } from '../constants/stages';

export const LEAD_SERVICE_STATUSES = ['Marcado', 'Confirmado', 'Em Execucao', 'Concluido', 'Reagendar'] as const;

export const leadStatusSchema = z.enum(LEAD_STAGES);
export const serviceStatusSchema = z.enum(LEAD_SERVICE_STATUSES);

export const leadNameSchema = z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres.');

export const leadPhoneSchema = z.string().trim().refine(
  (value) => value === '' || /^\d{10,11}$/.test(value),
  'Telefone deve conter 10 ou 11 digitos (ex.: 21999999999).',
);

export const leadEmailSchema = z.string().trim().refine(
  (value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  'E-mail invalido.',
);

export const leadSqmSchema = z.number().positive('Area (m2) deve ser maior que zero.');
export const leadValueSchema = z.number().min(0, 'Valor nao pode ser negativo.');

export const leadFormSchema = z.object({
  name: leadNameSchema,
  phone: leadPhoneSchema,
  email: leadEmailSchema,
  address: z.string(),
  neighborhood: z.string(),
  filmType: z.string(),
  sqm: leadSqmSchema,
  value: leadValueSchema,
  status: leadStatusSchema,
  notes: z.string(),
  statusChangedAt: z.string(),
  dataServico: z.string().nullable().optional(),
  serviceStatus: serviceStatusSchema.nullable().optional(),
  proximoContato: z.string().nullable().optional(),
  dormant: z.boolean(),
  pinned: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export type LeadFormSchema = z.infer<typeof leadFormSchema>;

export const leadPayloadSchema = leadFormSchema.extend({
  sqm: z.number().min(0, 'Area (m2) nao pode ser negativa.'),
  id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
});
