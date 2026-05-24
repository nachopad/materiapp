import { renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';

import { useAuthStore } from '../store/auth.store';
import { useAuthStatus, useIsAuthenticated, useAuthUser, useHasRole, useAuthState } from './use-auth';

describe('use-auth hooks', () => {
    beforeEach(() => {
        useAuthStore.setState({ status: 'idle', user: null });
    });

    it('useIsAuthenticated returns true when status is authenticated', () => {
        useAuthStore.setState({ status: 'authenticated', user: null });
        const { result } = renderHook(() => useIsAuthenticated());
        expect(result.current).toBe(true);
    });

    it('useIsAuthenticated returns false when not authenticated', () => {
        useAuthStore.setState({ status: 'anonymous', user: null });
        const { result } = renderHook(() => useIsAuthenticated());
        expect(result.current).toBe(false);
    });

    it('useAuthUser returns current user', () => {
        const user = { id: '1', email: 'a@b.com', name: 'Test', roles: ['user' as const], isGoogleUser: false };
        useAuthStore.setState({ status: 'authenticated', user });
        const { result } = renderHook(() => useAuthUser());
        expect(result.current).toEqual(user);
    });

    it('useHasRole checks roles correctly', () => {
        const user = { id: '2', email: 'b@c.com', name: 'Admin', roles: ['admin' as const, 'user' as const], isGoogleUser: false };
        useAuthStore.setState({ status: 'authenticated', user });
        const { result: adminResult } = renderHook(() => useHasRole('admin'));
        expect(adminResult.current).toBe(true);

        const { result: studentResult } = renderHook(() => useHasRole('student'));
        expect(studentResult.current).toBe(false);
    });

    it('useAuthStatus returns current status', () => {
        useAuthStore.setState({ status: 'loading', user: null });
        const { result } = renderHook(() => useAuthStatus());
        expect(result.current).toBe('loading');
    });

    it('useAuthState bundles status, user, and isAuthenticated', () => {
        const user = { id: '3', email: 'c@d.com', name: 'State', roles: ['user' as const], isGoogleUser: false };
        useAuthStore.setState({ status: 'authenticated', user });
        const { result } = renderHook(() => useAuthState());
        expect(result.current.status).toBe('authenticated');
        expect(result.current.user).toEqual(user);
        expect(result.current.isAuthenticated).toBe(true);
    });
});
