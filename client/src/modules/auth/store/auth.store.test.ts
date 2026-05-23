import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    profile: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    fetchCsrfToken: vi.fn(),
}));

vi.mock('../services/auth.service', () => ({
    authService: {
        profile: mocks.profile,
        login: mocks.login,
        logout: mocks.logout,
        refresh: mocks.refresh,
        fetchCsrfToken: mocks.fetchCsrfToken,
    },
}));

import { AUTH_ROLE } from '../types/auth.types';

import { useAuthStore } from './auth.store';

describe('auth.store', () => {
    beforeEach(() => {
        useAuthStore.setState({ status: 'idle', user: null });
        vi.clearAllMocks();
    });

    it('initializes with idle status and null user', () => {
        const state = useAuthStore.getState();
        expect(state.status).toBe('idle');
        expect(state.user).toBeNull();
    });

    it('bootstrap: idle -> loading -> authenticated on profile success', async () => {
        const user = { id: '1', email: 'a@b.com', name: 'Test', roles: ['user'], isGoogleUser: false };
        mocks.profile.mockResolvedValue(user);

        const promise = useAuthStore.getState().bootstrap();
        expect(useAuthStore.getState().status).toBe('loading');

        await promise;
        expect(useAuthStore.getState().status).toBe('authenticated');
        expect(useAuthStore.getState().user).toEqual(user);
    });

    it('bootstrap: idle -> loading -> anonymous on profile failure', async () => {
        mocks.profile.mockRejectedValue(new Error('Unauthorized'));

        const promise = useAuthStore.getState().bootstrap();
        expect(useAuthStore.getState().status).toBe('loading');

        await promise;
        expect(useAuthStore.getState().status).toBe('anonymous');
        expect(useAuthStore.getState().user).toBeNull();
    });

    it('login: sets loading then authenticated on success', async () => {
        const user = { id: '2', email: 'b@c.com', name: 'Login', roles: ['user'], isGoogleUser: false };
        mocks.login.mockResolvedValue(user);

        const promise = useAuthStore.getState().login({ email: 'b@c.com', password: 'secret' });
        expect(useAuthStore.getState().status).toBe('loading');

        await promise;
        expect(useAuthStore.getState().status).toBe('authenticated');
        expect(useAuthStore.getState().user).toEqual(user);
    });

    it('login: sets loading then anonymous on failure and throws', async () => {
        mocks.login.mockRejectedValue(new Error('Bad credentials'));

        const promise = useAuthStore.getState().login({ email: 'x@y.com', password: 'wrong' });
        expect(useAuthStore.getState().status).toBe('loading');

        await expect(promise).rejects.toThrow('Login failed');
        expect(useAuthStore.getState().status).toBe('anonymous');
        expect(useAuthStore.getState().user).toBeNull();
    });

    it('logout: calls service then resets to anonymous', async () => {
        useAuthStore.setState({
            status: 'authenticated',
            user: { id: '3', email: 'c@d.com', name: 'Out', roles: ['user'], isGoogleUser: false },
        });
        mocks.logout.mockResolvedValue(undefined);

        await useAuthStore.getState().logout();
        expect(mocks.logout).toHaveBeenCalledTimes(1);
        expect(useAuthStore.getState().status).toBe('anonymous');
        expect(useAuthStore.getState().user).toBeNull();
    });

    it('logout: throws and preserves authenticated state on service failure', async () => {
        const user = { id: '3', email: 'c@d.com', name: 'Out', roles: [AUTH_ROLE.USER], isGoogleUser: false };
        useAuthStore.setState({
            status: 'authenticated',
            user,
        });
        mocks.logout.mockRejectedValue(new Error('network error'));

        await expect(useAuthStore.getState().logout()).rejects.toThrow('network error');
        expect(useAuthStore.getState().status).toBe('authenticated');
        expect(useAuthStore.getState().user).toEqual(user);
    });

    it('clear: resets status to anonymous and user to null', () => {
        useAuthStore.setState({
            status: 'authenticated',
            user: { id: '4', email: 'd@e.com', name: 'Clear', roles: ['admin'], isGoogleUser: false },
        });

        useAuthStore.getState().clear();
        expect(useAuthStore.getState().status).toBe('anonymous');
        expect(useAuthStore.getState().user).toBeNull();
    });
});
