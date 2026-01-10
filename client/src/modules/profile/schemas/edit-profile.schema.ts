import { z } from 'zod';

export const personalInfoSchema = z.object({
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
        newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
        confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
