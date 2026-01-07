import z from 'zod';

export const mailSchema = z.object({
    HOST_MAIL: z.string().min(13).max(15).default('smtp.gmail.com'),
    PORT_MAIL: z.string().transform(Number).pipe(z.number().min(0)).default(587),
    SECURE: z.string().transform((val) => val === 'true').default(false),
    USER_REMITENTE: z.string().min(10).max(25).default('materiapp.oficial@gmail.com'),
    PASSWORD_APP: z.string().min(19).max(19),
});