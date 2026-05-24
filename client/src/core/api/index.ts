import axios, { AxiosError } from 'axios';

import { useAuthStore } from '@/modules/auth/store/auth.store';

import { VITE_API_URL } from '../config';
import { UnauthorizedError } from './types';
import type { ApiRequestConfig } from './types';

export const api = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
    timeout: 8000,
    headers: {
        'Accept-Version': '1',
    },
});

// Skipped auth endpoints (never trigger refresh retry)
const AUTH_ENDPOINTS = [
    '/auth/login',
    '/auth/logout',
    '/auth/refresh',
    '/auth/register',
    '/security/csrf-token',
];

function isAuthEndpoint(url?: string): boolean {
    if (!url) return false;
    return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

// CSRF helper stub
// PR 3 will implement this when backend exposes a readable CSRF token.
export async function ensureCsrfToken(): Promise<void> {
    return Promise.resolve();
}

// Module-level refresh promise for concurrent 401 handling
let refreshPromise: Promise<void> | null = null;

async function performRefresh(): Promise<void> {
    try {
        await api.post('/auth/refresh');
    } catch (error) {
        // Refresh failed: clear auth state and force re-authentication
        useAuthStore.getState().clear();
        throw error;
    } finally {
        refreshPromise = null;
    }
}

// Request interceptor: ensure version header and CSRF stub
api.interceptors.request.use(
    async (config) => {
        config.headers.set('Accept-Version', '1');
        // CSRF injection for protected mutations (stubbed until PR 3)
        // await ensureCsrfToken();
        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor: one-shot 401 refresh with queue
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as ApiRequestConfig | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const status = error.response?.status;

        // Not a 401, already retried, or auth endpoint: reject immediately
        if (status !== 401 || originalRequest._authRetry || isAuthEndpoint(originalRequest.url)) {
            if (status === 401) {
                return Promise.reject(new UnauthorizedError(error.message));
            }
            return Promise.reject(error);
        }

        // Concurrent 401s share a single refresh cycle
        if (!refreshPromise) {
            refreshPromise = performRefresh();
        }

        try {
            await refreshPromise;
            // Retry original request exactly once
            originalRequest._authRetry = true;
            return api(originalRequest);
        } catch {
            return Promise.reject(new UnauthorizedError('Session expired'));
        }
    },
);
