/**
 * Progress module types
 */

export const SUBJECT_STATUS = {
    APPROVED: 'approved',
    REGULAR: 'regular',
    PENDING: 'pending',
} as const;

export type SubjectStatus = (typeof SUBJECT_STATUS)[keyof typeof SUBJECT_STATUS];

export interface Subject {
    id: string;
    name: string;
    status: SubjectStatus;
    year: number;
    grade?: number;
}

export interface Career {
    id: string;
    name: string;
    universityName: string;
    universityAbbreviation?: string;
    universityLogo?: string;
    progress: number;
    approved: number;
    regular: number;
    pending: number;
    average: number;
    subjects: Subject[];
}
