import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '../store/auth.store';
import type { AuthRole } from '../types/auth.types';

export { useAuthStore };

export function useIsAuthenticated(): boolean {
    return useAuthStore((state) => state.status === 'authenticated');
}

export function useAuthUser() {
    return useAuthStore((state) => state.user);
}

export function useHasRole(role: AuthRole): boolean {
    return useAuthStore((state) => state.user?.roles.includes(role) ?? false);
}

export function useAuthStatus() {
    return useAuthStore((state) => state.status);
}

export function useAuthState() {
    return useAuthStore(
        useShallow((state) => ({
            status: state.status,
            user: state.user,
            isAuthenticated: state.status === 'authenticated',
        })),
    );
}
