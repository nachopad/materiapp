import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

const mockMutation = {
    mutate: vi.fn(),
    isPending: false,
    isError: false,
};

vi.mock('@/modules/auth/hooks/use-logout-mutation', () => ({
    useLogoutMutation: () => mockMutation,
}));

vi.mock('next-themes', () => ({
    useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
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

import { SidebarFooterComponent } from './sidebar-footer';

function renderWithProvider(ui: React.ReactNode) {
    return render(
        <MemoryRouter>
            <SidebarProvider>{ui}</SidebarProvider>
        </MemoryRouter>,
    );
}

describe('sidebar-footer logout', () => {
    const defaultUser = {
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'https://example.com/avatar.png',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockMutation.mutate.mockClear();
        mockMutation.isPending = false;
        mockMutation.isError = false;
    });

    it('calls mutate when logout menu item is selected', async () => {
        const user = userEvent.setup();
        renderWithProvider(<SidebarFooterComponent user={defaultUser} />);

        const trigger = screen.getByRole('button', { name: /Test User/i });
        await user.click(trigger);

        const logoutItem = screen.getByRole('menuitem', { name: 'Cerrar sesión' });
        await user.click(logoutItem);

        expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
    });

    it('disables logout item and shows pending label during logout', async () => {
        mockMutation.isPending = true;

        const user = userEvent.setup();
        renderWithProvider(<SidebarFooterComponent user={defaultUser} />);

        const trigger = screen.getByRole('button', { name: /Test User/i });
        await user.click(trigger);

        const logoutItem = screen.getByRole('menuitem', { name: 'Cerrando sesión...' });
        expect(logoutItem).toHaveAttribute('aria-disabled', 'true');
    });

    it('shows accessible error feedback when logout fails', async () => {
        mockMutation.isError = true;

        const user = userEvent.setup();
        renderWithProvider(<SidebarFooterComponent user={defaultUser} />);

        const trigger = screen.getByRole('button', { name: /Test User/i });
        await user.click(trigger);

        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Error al cerrar sesión. Inténtalo de nuevo.');
    });
});
