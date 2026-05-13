import { z } from 'zod';
import { SUBJECT_STATUS } from '../types';

const approvedSchema = z.object({
    status: z.literal(SUBJECT_STATUS.APPROVED),
    grade: z.coerce.number().min(1, { error: 'La nota mínima es 1' }).max(10, { error: 'La nota máxima es 10' }),
});

const regularSchema = z.object({
    status: z.literal(SUBJECT_STATUS.REGULAR),
}).strict();

const pendingSchema = z.object({
    status: z.literal(SUBJECT_STATUS.PENDING),
}).strict();

export const subjectStatusSchema = z.discriminatedUnion('status', [
    approvedSchema,
    regularSchema,
    pendingSchema,
]);

export type SubjectStatusFormValues = z.infer<typeof subjectStatusSchema>;
