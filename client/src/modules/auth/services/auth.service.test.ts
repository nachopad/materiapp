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

    it('login: posts credentials and unwraps envelope to map _id to id', async () => {
        const backendUser = { _id: '1', email: 'a@b.com', name: 'Test', roles: ['user'], isGoogleUser: false };
        mocks.post.mockResolvedValue({
            data: {
                _metadata: { statusCode: 200, timestamp: '2026-05-27T00:38:52.743Z', path: '/api/auth/login' },
                data: backendUser,
            },
        });

        const result = await authService.login({ email: 'a@b.com', password: 'secret' });
        expect(mocks.post).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', password: 'secret' });
        expect(result).toEqual({ id: '1', email: 'a@b.com', name: 'Test', roles: ['user'], isGoogleUser: false });
    });

    it('logout: posts to /auth/logout', async () => {
        mocks.post.mockResolvedValue({ data: undefined });
        await authService.logout();
        expect(mocks.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('profile: gets /auth/profile and unwraps envelope to map _id to id', async () => {
        const backendUser = { _id: '2', email: 'b@c.com', name: 'Profile', roles: ['admin'], isGoogleUser: false };
        mocks.get.mockResolvedValue({
            data: {
                _metadata: { statusCode: 200, timestamp: '2026-05-27T00:38:52.743Z', path: '/api/auth/profile' },
                data: backendUser,
            },
        });

        const result = await authService.profile();
        expect(mocks.get).toHaveBeenCalledWith('/auth/profile');
        expect(result).toEqual({ id: '2', email: 'b@c.com', name: 'Profile', roles: ['admin'], isGoogleUser: false });
    });

    it('profile: maps createdAt and updatedAt from envelope', async () => {
        const backendUser = {
            _id: '3',
            email: 'c@d.com',
            name: 'WithDates',
            roles: ['user'],
            createdAt: '2025-09-25T21:51:28.112Z',
            updatedAt: '2025-09-26T10:00:00.000Z',
        };
        mocks.get.mockResolvedValue({
            data: {
                _metadata: { statusCode: 200, timestamp: '2026-05-27T00:38:52.743Z', path: '/api/auth/profile' },
                data: backendUser,
            },
        });

        const result = await authService.profile();
        expect(result.createdAt).toBe('2025-09-25T21:51:28.112Z');
        expect(result.updatedAt).toBe('2025-09-26T10:00:00.000Z');
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
