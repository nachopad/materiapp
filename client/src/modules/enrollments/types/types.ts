/**
 * Enrollments module types
 */

export type EnrollmentState = 'approved' | 'regular' | 'stateless';

export interface College {
    _id: string;
    name: string;
    logo?: string;
}

export interface Career {
    _id: string;
    name: string;
    description?: string;
}

export interface Subject {
    _id: string;
    name: string;
    year?: number;
}

export interface SubjectEnrollment {
    subject: Subject;
    qualification?: number;
    date?: Date;
    state: EnrollmentState;
}

export interface Enrollment {
    _id: string;
    college: College;
    career: Career;
    subjects: SubjectEnrollment[];
    createdAt: Date;
    updatedAt: Date;
}
