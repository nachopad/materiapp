import { useQuery } from '@tanstack/react-query';
import { enrollmentsService } from '../services';
import type { Enrollment } from '../types';

const QUERY_KEYS = {
    enrollments: ['enrollments'] as const,
    enrollment: (id: string) => ['enrollments', id] as const,
};

/**
 * Hook to fetch all enrollments for the logged user
 */
export function useEnrollments() {
    return useQuery<Enrollment[], Error>({
        queryKey: QUERY_KEYS.enrollments,
        queryFn: enrollmentsService.getEnrollments,
    });
}
