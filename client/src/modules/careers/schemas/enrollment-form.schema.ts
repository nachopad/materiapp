/**
 * Schema module for careers enrollment forms.
 * Centralizes validation schema and types for all enrollment entry points.
 */

import { z } from 'zod';

/**
 * Date mode literals for enrollment date input.
 */
export const DATE_MODE_VALUES = ['fullDate', 'monthYear'] as const;

/**
 * Supported date input modes.
 * - `fullDate`: YYYY-MM-DD format
 * - `monthYear`: YYYY-MM format
 */
export type DateMode = (typeof DATE_MODE_VALUES)[number];

/**
 * Zod schema for enrollment form validation.
 * Uses discriminated union pattern based on dateMode to validate only the active field.
 */
const fullDateVariant = z.object({
    dateMode: z.literal('fullDate'),
    fullDate: z.string().min(1, 'Debes ingresar una fecha válida'),
    monthYear: z.string().optional(),
});

/**
 * monthYear mode variant - requires monthYear field when dateMode is 'monthYear'.
 */
const monthYearVariant = z.object({
    dateMode: z.literal('monthYear'),
    fullDate: z.string().optional(),
    monthYear: z.string().min(1, 'Debes ingresar una fecha válida'),
});

export const enrollmentSchema = z.discriminatedUnion('dateMode', [
    fullDateVariant,
    monthYearVariant,
]);

/**
 * Inferred type from the enrollment schema.
 * Use this type for RHF useForm<EnrollmentFormValues>().
 */
export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;