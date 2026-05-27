import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

import { useAuthUser } from '@/modules/auth/hooks/use-auth';

vi.mock('@/assets/icons', () => ({
    Google: () => <svg data-testid="google-icon" />,
}));

vi.mock('@/modules/auth/hooks/use-auth', () => ({
    useAuthUser: vi.fn(() => undefined),
}));

const mockMutation = {
    mutate: vi.fn(),
    isPending: false,
    isError: false,
};

vi.mock('@/modules/auth/hooks/use-logout-mutation', () => ({
    useLogoutMutation: () => mockMutation,
}));

import ProfilePage from './profile.page';

function renderPage() {
    return render(
        <MemoryRouter>
            <ProfilePage />
        </MemoryRouter>,
    );
}

describe('profile.page logout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockMutation.mutate.mockClear();
        mockMutation.isPending = false;
        mockMutation.isError = false;
    });

    it('calls mutate when logout button is clicked', async () => {
        const user = userEvent.setup();
        renderPage();

        const logoutButton = screen.getByRole('button', { name: 'Cerrar sesión' });
        await user.click(logoutButton);

        expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
    });

    it('disables button and shows pending label during logout', () => {
        mockMutation.isPending = true;

        renderPage();

        const logoutButton = screen.getByRole('button', { name: 'Cerrando sesión...' });
        expect(logoutButton).toBeDisabled();
    });

    it('shows accessible error feedback when logout fails', () => {
        mockMutation.isError = true;

        renderPage();

        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Error al cerrar sesión. Inténtalo de nuevo.');
    });
});

describe('profile.page identity', () => {
    beforeEach(() => {
        vi.mocked(useAuthUser).mockReturnValue(null);
    });

    it('prioritizes auth identity over mock profile in header', () => {
        vi.mocked(useAuthUser).mockReturnValue({
            id: '99',
            name: 'Auth User',
            email: 'auth@example.com',
            roles: ['user'],
            isGoogleUser: false,
        });

        renderPage();

        expect(screen.getByText('Auth User')).toBeInTheDocument();
        expect(screen.getByText('auth@example.com')).toBeInTheDocument();
    });

    it('keeps universities and progress sections from mock data unchanged', () => {
        vi.mocked(useAuthUser).mockReturnValue({
            id: '99',
            name: 'Auth User',
            email: 'auth@example.com',
            roles: ['user'],
            isGoogleUser: false,
        });

        renderPage();

        expect(screen.getByText('Universidades')).toBeInTheDocument();
        expect(screen.getByText('Universidad Nacional de Jujuy')).toBeInTheDocument();
        expect(screen.getByText('Progreso')).toBeInTheDocument();
        expect(screen.getByText('Analista Programador Universitario')).toBeInTheDocument();
    });

    it('falls back to profile name when auth name is missing', () => {
        vi.mocked(useAuthUser).mockReturnValue({
            id: '99',
            name: '',
            email: 'auth@example.com',
            roles: ['user'],
            isGoogleUser: false,
        });

        renderPage();

        expect(screen.getByText('Maximiliano Joaquín Carrillo')).toBeInTheDocument();
        expect(screen.getByText('auth@example.com')).toBeInTheDocument();
    });

    it('keeps profile header text wrapped and constrained for narrow viewports', () => {
        vi.mocked(useAuthUser).mockReturnValue({
            id: '99',
            name: 'A very long name that should not overflow the narrow container on a mobile viewport',
            email: 'auth@example.com',
            roles: ['user'],
            isGoogleUser: false,
        });

        renderPage();

        const nameHeading = screen.getByText(
            'A very long name that should not overflow the narrow container on a mobile viewport',
        );
        expect(nameHeading.className).toContain('text-wrap');
        expect(nameHeading.className).toContain('min-w-0');
    });

    it('uses auth user createdAt for joined date when profile data is not loaded', () => {
        vi.mocked(useAuthUser).mockReturnValue({
            id: '99',
            name: 'Auth User',
            email: 'auth@example.com',
            roles: ['user'],
            isGoogleUser: false,
            createdAt: '2025-09-25T21:51:28.112Z',
        });

        renderPage();

        const joinDateEl = screen.getByText(/Se unió en/);
        expect(joinDateEl.textContent).toMatch(/2025/);
    });
});
