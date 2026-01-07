import z from 'zod';

export const securitySchema = z.object({
  CSRF_SECRET: z.string().min(8).default('a-very-secret-key'),
  CSRF_EXPIRES_IN: z
    .string()
    .transform(Number)
    .pipe(z.number().min(0))
    .default(3600),
});
