import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

vi.mock('@/assets/icons', () => ({
    Google: () => <svg data-testid="google-icon" />,
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
