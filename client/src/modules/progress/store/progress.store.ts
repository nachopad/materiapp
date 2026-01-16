import { create } from 'zustand';

interface ProgressState {
    selectedCareerId: string | null;
    selectCareer: (id: string) => void;
    clearSelection: () => void;
}

/**
 * Store for managing selected career state.
 * Data fetching is handled by React Query hooks.
 */
export const useProgressStore = create<ProgressState>((set) => ({
    selectedCareerId: null,

    selectCareer: (id: string) => set({ selectedCareerId: id }),

    clearSelection: () => set({ selectedCareerId: null }),
}));
