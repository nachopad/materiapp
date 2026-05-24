import { api } from '@/core/api';

import type { AuthUser, LoginCredentials } from '../types/auth.types';

interface BackendUserResponse {
    _id: string;
    email: string;
    name: string;
    roles: string[];
    isGoogleUser: boolean;
}

function mapToAuthUser(data: unknown): AuthUser {
    const backend = data as BackendUserResponse;
    return {
        id: backend._id,
        email: backend.email,
        name: backend.name,
        roles: backend.roles as AuthUser['roles'],
        isGoogleUser: backend.isGoogleUser,
    };
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthUser> {
        const response = await api.post<BackendUserResponse>('/auth/login', credentials);
        return mapToAuthUser(response.data);
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async profile(): Promise<AuthUser> {
        const response = await api.get<BackendUserResponse>('/auth/profile');
        return mapToAuthUser(response.data);
    },

    async refresh(): Promise<void> {
        await api.post('/auth/refresh');
    },

    async fetchCsrfToken(): Promise<void> {
        // Stub: backend does not expose a readable CSRF token yet (httpOnly cookie).
        // PR 3 will implement this when backend exposes a readable token or companion cookie.
        return Promise.resolve();
    },
};
