import { create } from 'zustand';

interface EnrollmentsState {
    selectedEnrollmentId: string | null;
    selectEnrollment: (id: string) => void;
    clearSelection: () => void;
}

/**
 * Store for managing selected enrollment state.
 * Data fetching is handled by React Query hooks.
 */
export const useEnrollmentsStore = create<EnrollmentsState>((set) => ({
    selectedEnrollmentId: null,

    selectEnrollment: (id: string) => set({ selectedEnrollmentId: id }),

    clearSelection: () => set({ selectedEnrollmentId: null }),
}));
