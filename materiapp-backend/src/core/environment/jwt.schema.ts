import z from 'zod';

export const jwtSchema = z.object({
  JWT_ACCESS_SECRET: z.string().min(16).max(64),
  JWT_ACCESS_EXPIRES_IN: z.string().transform(Number).pipe(z.number().min(0)),
  JWT_REFRESH_SECRET: z.string().min(16).max(64),
  JWT_REFRESH_EXPIRES_IN: z.string().transform(Number).pipe(z.number().min(0)),
});
