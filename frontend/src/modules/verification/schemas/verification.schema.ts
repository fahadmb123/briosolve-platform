import { z } from 'zod';

export const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_DOCUMENT_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const fileItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.string(),
  url: z.string(),
  file: z.custom<File>((val) => val instanceof File).optional(),
  isImage: z.boolean().optional(),
});

export const verificationRequestSchema = z.object({
  document_type: z.enum(['IDENTITY', 'CERTIFICATE']),
  document_name: z
    .string()
    .trim()
    .min(2, 'Document name must be at least 2 characters')
    .max(100, 'Document name cannot exceed 100 characters'),
  files: z
    .array(fileItemSchema)
    .min(1, 'Please upload at least one document image or PDF file'),
});

export type VerificationRequestFormData = z.infer<typeof verificationRequestSchema>;
