/**
 * Types for the careers feature module.
 */

/**
 * Represents a career in the system.
 */
export interface Career {
    id: string;
    name: string;
    durationYears: number;
    totalSubjects: number;
}

/**
 * Represents an enrollment date entry.
 * Either a full ISO date or a month/year combination.
 */
export type EnrollmentDate =
    | { mode: 'fullDate'; value: string }
    | { mode: 'monthYear'; value: string };