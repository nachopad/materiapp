import { z } from 'zod';

const envSchema = z.object({
    VITE_API_BASE_URL: z.string(),
});

const { success, data, error } = envSchema.safeParse(import.meta.env);

if (!success) {
    console.error('Invalid environment variables:', z.treeifyError(error));
    throw new Error('Invalid environment variables');
}

export const { VITE_API_BASE_URL } = data;
