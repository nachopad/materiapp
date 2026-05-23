import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockLogout = vi.fn();

vi.mock('@/modules/auth/store/auth.store', () => ({
    useAuthStore: {
        getState: () => ({
            logout: mockLogout,
        }),
    },
}));

import { useLogoutMutation } from './use-logout-mutation';

function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
}

function wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>;
}

describe('useLogoutMutation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls store logout once on mutate', async () => {
        mockLogout.mockResolvedValue(undefined);

        const { result } = renderHook(() => useLogoutMutation(), { wrapper });

        result.current.mutate();

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalledTimes(1);
        });
    });

    it('navigates to /login with replace on success', async () => {
        mockLogout.mockResolvedValue(undefined);

        const { result } = renderHook(() => useLogoutMutation(), { wrapper });

        result.current.mutate();

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
        });
    });

    it('does not navigate on error', async () => {
        mockLogout.mockRejectedValue(new Error('network error'));

        const { result } = renderHook(() => useLogoutMutation(), { wrapper });

        result.current.mutate();

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
