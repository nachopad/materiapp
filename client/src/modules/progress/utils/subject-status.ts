import { SUBJECT_STATUS } from '../types';
import type { Subject, SubjectStatus } from '../types';

export const STATUS_LABELS: Record<SubjectStatus, string> = {
    [SUBJECT_STATUS.APPROVED]: 'Aprobada',
    [SUBJECT_STATUS.REGULAR]: 'Cursando',
    [SUBJECT_STATUS.PENDING]: 'Pendiente',
};

export const GRADE_BOUNDS = {
    MIN: 1,
    MAX: 10,
} as const;

export interface SubjectStatusUpdate {
    status: SubjectStatus;
    grade?: number;
}

export interface CareerProgressStats {
    approved: number;
    regular: number;
    pending: number;
    progress: number;
    average: number;
}

export function normalizeSubjectStatusUpdate(update: SubjectStatusUpdate): SubjectStatusUpdate {
    if (
        update.status === SUBJECT_STATUS.APPROVED &&
        update.grade !== undefined &&
        update.grade >= GRADE_BOUNDS.MIN &&
        update.grade <= GRADE_BOUNDS.MAX
    ) {
        return { status: SUBJECT_STATUS.APPROVED, grade: update.grade };
    }
    return { status: update.status, grade: undefined };
}

export function recalculateCareerProgress(subjects: Subject[]): CareerProgressStats {
    const total = subjects.length;
    const approved = subjects.filter((s) => s.status === SUBJECT_STATUS.APPROVED).length;
    const regular = subjects.filter((s) => s.status === SUBJECT_STATUS.REGULAR).length;
    const pending = subjects.filter((s) => s.status === SUBJECT_STATUS.PENDING).length;
    const progress = total > 0 ? Math.round((approved / total) * 100) : 0;

    const approvedGrades = subjects
        .filter((s) => s.status === SUBJECT_STATUS.APPROVED && s.grade !== undefined)
        .map((s) => s.grade!);

    const average =
        approvedGrades.length > 0
            ? Math.round((approvedGrades.reduce((sum, g) => sum + g, 0) / approvedGrades.length) * 10) / 10
            : 0;

    return { approved, regular, pending, progress, average };
}
