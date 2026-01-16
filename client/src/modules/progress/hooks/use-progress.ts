import { useQuery } from '@tanstack/react-query';
import { progressService } from '../services';
import type { Career } from '../types';

const QUERY_KEYS = {
    careers: ['careers'] as const,
    career: (id: string) => ['careers', id] as const,
};

/**
 * Hook to fetch all careers with progress data
 */
export function useCareers() {
    return useQuery<Career[], Error>({
        queryKey: QUERY_KEYS.careers,
        queryFn: progressService.getCareers,
    });
}

/**
 * Hook to fetch a specific career by ID
 */
export function useCareer(careerId: string | null) {
    return useQuery<Career, Error>({
        queryKey: QUERY_KEYS.career(careerId ?? ''),
        queryFn: () => progressService.getCareerById(careerId!),
        enabled: !!careerId,
    });
}
