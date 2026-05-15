import { create } from 'zustand';
import type { EnrollmentDate } from '@/modules/careers/types';

interface EnrollmentsState {
    selectedEnrollmentId: string | null;
    enrolledCareerIds: string[];
    selectEnrollment: (id: string) => void;
    clearSelection: () => void;
    enroll: (careerId: string, date: EnrollmentDate) => void;
    isEnrolled: (careerId: string) => boolean;
}

/**
 * Store for managing selected enrollment state and enrolled careers.
 * Data fetching is handled by React Query hooks.
 * Mock enrollment state is stored locally via enrolledCareerIds.
 */
export const useEnrollmentsStore = create<EnrollmentsState>((set, get) => ({
    selectedEnrollmentId: null,
    enrolledCareerIds: [],

    selectEnrollment: (id: string) => set({ selectedEnrollmentId: id }),

    clearSelection: () => set({ selectedEnrollmentId: null }),

    enroll: (careerId: string, date: EnrollmentDate) => {
        // date stored for future backend integration
        void date;
        set((state) => ({
            enrolledCareerIds: state.enrolledCareerIds.includes(careerId)
                ? state.enrolledCareerIds
                : [...state.enrolledCareerIds, careerId],
        }));
    },

    isEnrolled: (careerId: string) => {
        return get().enrolledCareerIds.includes(careerId);
    },
}));