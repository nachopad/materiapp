import z from 'zod';

export const databaseSchema = z.object({
  DATABASE_HOST: z.string().min(2).max(100).default('localhost'),
  DATABASE_PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().min(0))
    .default(27017),
  DATABASE_NAME: z.string().min(2).max(100).default('materiapp'),
});
