import z from 'zod';

export const commonSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(0)).default(3000),
});
