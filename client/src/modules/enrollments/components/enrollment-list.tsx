import type { Enrollment } from '../types';
import { EnrollmentCard } from './enrollment-card';

interface EnrollmentListProps {
    enrollments: Enrollment[];
    selectedEnrollmentId?: string | null;
    onSelectEnrollment?: (id: string) => void;
}

/**
 * List of enrollments grouped by university/college.
 */
export function EnrollmentList({ enrollments, selectedEnrollmentId, onSelectEnrollment }: EnrollmentListProps) {
    // Group enrollments by college
    const groupedEnrollments = enrollments.reduce(
        (acc, enrollment) => {
            const collegeName = enrollment.college.name;
            if (!acc[collegeName]) {
                acc[collegeName] = [];
            }
            acc[collegeName].push(enrollment);
            return acc;
        },
        {} as Record<string, Enrollment[]>,
    );

    return (
        <div className="space-y-3">
            {Object.entries(groupedEnrollments).map(([collegeName, collegeEnrollments]) => (
                <section key={collegeName} className="space-y-3">
                    <h1 className="inline-block text-base font-medium px-4 bg-secondary/50 text-secondary-foreground rounded-full">
                        {collegeName}
                    </h1>
                    <div className="space-y-3">
                        {collegeEnrollments.map((enrollment) => (
                            <EnrollmentCard
                                key={enrollment._id}
                                enrollment={enrollment}
                                isSelected={selectedEnrollmentId === enrollment._id}
                                onClick={() => onSelectEnrollment?.(enrollment._id)}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
