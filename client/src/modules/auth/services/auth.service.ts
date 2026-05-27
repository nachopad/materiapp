import { api } from '@/core/api';

import type { AuthUser, LoginCredentials } from '../types/auth.types';

interface ApiEnvelope<T> {
    _metadata: {
        statusCode: number;
        timestamp: string;
        path: string;
    };
    data: T;
}

interface BackendUserResponse {
    _id: string;
    email: string;
    name: string;
    roles: string[];
    isGoogleUser?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

function mapToAuthUser(data: unknown): AuthUser {
    const backend = data as BackendUserResponse;
    return {
        id: backend._id,
        email: backend.email,
        name: backend.name,
        roles: backend.roles as AuthUser['roles'],
        isGoogleUser: backend.isGoogleUser ?? false,
        createdAt: backend.createdAt,
        updatedAt: backend.updatedAt,
    };
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthUser> {
        const response = await api.post<ApiEnvelope<BackendUserResponse>>('/auth/login', credentials);
        return mapToAuthUser(response.data.data);
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async profile(): Promise<AuthUser> {
        const response = await api.get<ApiEnvelope<BackendUserResponse>>('/auth/profile');
        return mapToAuthUser(response.data.data);
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
