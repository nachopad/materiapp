/**
 * Dashboard Home types for authenticated root page.
 */

export interface AcademicSummary {
    activeCareers: number;
    facultiesEnrolled: number;
    subjectsInProgress: number;
    subjectsApproved: number;
}

/**
 * Subject being taken in current semester
 */
export interface CurrentSubject {
    id: string;
    name: string;
    careerName: string;
}

/**
 * Active career with details for list display
 */
export interface ActiveCareer {
    id: string;
    name: string;
    facultyName: string;
    year: number;
    progress: number;
}

export interface DashboardHome {
    summary: AcademicSummary;
    currentSubjects: CurrentSubject[];
    activeCareersList: ActiveCareer[];
}
