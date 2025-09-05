import z from 'zod';

export const bycriptSchema = z.object({
  SALT_ROUNDS: z.string().transform(Number).pipe(z.number().min(0)),
});
