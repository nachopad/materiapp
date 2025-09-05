import  z  from 'zod';

export const googleSchema = z.object({
    GOOGLE_CLIENT_ID: z.string().min(16).max(128),
    GOOGLE_CLIENT_SECRET: z.string().min(16).max(64),
    GOOGLE_CALLBACK_URL: z.string(),
    GOOGLE_SECRET: z.string().min(16).max(64),
})