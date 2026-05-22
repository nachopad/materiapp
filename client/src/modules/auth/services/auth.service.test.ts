import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    post: vi.fn(),
    get: vi.fn(),
    ensureCsrfToken: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/core/api', () => ({
    api: {
        post: mocks.post,
        get: mocks.get,
    },
    ensureCsrfToken: mocks.ensureCsrfToken,
}));

import { authService } from './auth.service';

describe('auth.service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('login: posts credentials and maps _id to id', async () => {
        const backendUser = { _id: '1', email: 'a@b.com', name: 'Test', roles: ['user'], isGoogleUser: false };
        mocks.post.mockResolvedValue({ data: backendUser });

        const result = await authService.login({ email: 'a@b.com', password: 'secret' });
        expect(mocks.post).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', password: 'secret' });
        expect(result).toEqual({ id: '1', email: 'a@b.com', name: 'Test', roles: ['user'], isGoogleUser: false });
    });

    it('logout: posts to /auth/logout', async () => {
        mocks.post.mockResolvedValue({ data: undefined });
        await authService.logout();
        expect(mocks.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('profile: gets /auth/profile and maps _id to id', async () => {
        const backendUser = { _id: '2', email: 'b@c.com', name: 'Profile', roles: ['admin'], isGoogleUser: false };
        mocks.get.mockResolvedValue({ data: backendUser });

        const result = await authService.profile();
        expect(mocks.get).toHaveBeenCalledWith('/auth/profile');
        expect(result).toEqual({ id: '2', email: 'b@c.com', name: 'Profile', roles: ['admin'], isGoogleUser: false });
    });

    it('refresh: posts to /auth/refresh', async () => {
        mocks.post.mockResolvedValue({ data: undefined });
        await authService.refresh();
        expect(mocks.post).toHaveBeenCalledWith('/auth/refresh');
    });

    it('fetchCsrfToken: resolves immediately (stub)', async () => {
        await expect(authService.fetchCsrfToken()).resolves.toBeUndefined();
    });
});
