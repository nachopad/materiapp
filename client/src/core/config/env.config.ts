import { z } from 'zod';

const envSchema = z.object({
    VITE_ENV: z.enum(['development', 'production']).default('development'),
    VITE_API_URL: z.string(),
    VITE_BACKEND_URL: z.string(),
});

const { success, data, error } = envSchema.safeParse(import.meta.env);

if (!success) {
    console.error('Invalid environment variables:', z.treeifyError(error));
    throw new Error('Invalid environment variables');
}

export const { VITE_ENV: NODE_ENV, VITE_API_URL, VITE_BACKEND_URL } = data;
