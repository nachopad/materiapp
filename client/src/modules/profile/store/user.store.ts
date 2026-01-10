import { create } from 'zustand';
import type { UserProfile } from '../types';
import { profileService } from '../services';

interface UserState {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const user = await profileService.getProfile();
            set({ user, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch profile',
                isLoading: false,
            });
        }
    },

    updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const user = await profileService.updateProfile(data);
            set({ user, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update profile',
                isLoading: false,
            });
        }
    },

    clearUser: () => set({ user: null, error: null }),
}));
