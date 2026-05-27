import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

import { useAuthUser } from '@/modules/auth/hooks/use-auth';

vi.mock('@/modules/auth/hooks/use-auth', () => ({
    useAuthUser: vi.fn(() => undefined),
}));

vi.mock('@/modules/auth/hooks/use-logout-mutation', () => ({
    useLogoutMutation: () => ({
        mutate: vi.fn(),
        isPending: false,
        isError: false,
    }),
}));

vi.mock('next-themes', () => ({
    useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

vi.mock('@/assets/icons', () => ({
    Materiapp: () => <span data-testid="materiapp-icon">Materiapp</span>,
}));

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';

function renderWithProvider(ui: React.ReactNode) {
    return render(
        <MemoryRouter>
            <SidebarProvider>{ui}</SidebarProvider>
        </MemoryRouter>,
    );
}

describe('AppSidebar auth wiring', () => {
    it('renders authenticated user identity from useAuthUser in footer', () => {
        vi.mocked(useAuthUser).mockReturnValue({
            id: '1',
            name: 'María López',
            email: 'maria@example.com',
            roles: ['user'],
            isGoogleUser: false,
        });

        renderWithProvider(<AppSidebar />);

        expect(screen.getByText('María López')).toBeInTheDocument();
        expect(screen.getByText('maria@example.com')).toBeInTheDocument();
    });

    it('renders safe fallbacks when auth user is null', () => {
        vi.mocked(useAuthUser).mockReturnValue(null);

        renderWithProvider(<AppSidebar />);

        expect(screen.getByText('Usuario')).toBeInTheDocument();
        expect(screen.getByText('Sin email disponible')).toBeInTheDocument();
    });
});
