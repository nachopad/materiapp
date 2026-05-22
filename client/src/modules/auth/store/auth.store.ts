import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { queryClient } from '@/core/providers/query-client';

import { authService } from '../services/auth.service';
import type { AuthUser, LoginCredentials, SessionStatus } from '../types/auth.types';

interface AuthState {
    status: SessionStatus;
    user: AuthUser | null;

    bootstrap: () => Promise<void>;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    clear: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            status: 'idle',
            user: null,

            bootstrap: async () => {
                set({ status: 'loading' });
                try {
                    const user = await authService.profile();
                    set({ status: 'authenticated', user });
                } catch {
                    set({ status: 'anonymous', user: null });
                }
            },

            login: async (credentials) => {
                set({ status: 'loading' });
                try {
                    const user = await authService.login(credentials);
                    set({ status: 'authenticated', user });
                } catch {
                    set({ status: 'anonymous', user: null });
                    throw new Error('Login failed');
                }
            },

            logout: async () => {
                try {
                    await authService.logout();
                } catch {
                    // swallow error; always reset state
                } finally {
                    queryClient.clear();
                    set({ status: 'anonymous', user: null });
                }
            },

            clear: () => {
                queryClient.clear();
                set({ status: 'anonymous', user: null });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user }),
        },
    ),
);
