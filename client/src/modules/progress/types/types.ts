/**
 * Progress module types
 */

export type SubjectStatus = 'approved' | 'regular' | 'pending';

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
    universityLogo?: string;
    progress: number;
    approved: number;
    pending: number;
    average: number;
    subjects: Subject[];
}
