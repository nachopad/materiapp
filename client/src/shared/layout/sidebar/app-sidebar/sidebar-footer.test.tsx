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

vi.mock('@/shared/components/ui/avatar', () => ({
    Avatar: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className} data-testid="avatar">{children}</div>
    ),
    AvatarImage: ({ src, alt }: { src?: string; alt?: string }) => <img data-testid="avatar-image" src={src} alt={alt} />,
    AvatarFallback: ({ children }: { children: React.ReactNode }) => <span data-testid="avatar-fallback">{children}</span>,
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

describe('sidebar-footer identity rendering', () => {
    it('renders authenticated user name and email', () => {
        renderWithProvider(
            <SidebarFooterComponent user={{ name: 'Ana García', email: 'ana@example.com', avatar: undefined }} />,
        );

        expect(screen.getByText('Ana García')).toBeInTheDocument();
        expect(screen.getByText('ana@example.com')).toBeInTheDocument();
    });

    it('shows email fallback when email is missing', () => {
        renderWithProvider(
            <SidebarFooterComponent user={{ name: 'Ana García', email: '', avatar: undefined }} />,
        );

        expect(screen.getByText('Sin email disponible')).toBeInTheDocument();
    });

    it('renders initials fallback when avatar is missing', () => {
        renderWithProvider(
            <SidebarFooterComponent user={{ name: 'Ana García', email: 'ana@example.com', avatar: undefined }} />,
        );

        expect(screen.getByText('AG')).toBeInTheDocument();
        expect(screen.queryByAltText('Ana García')).not.toBeInTheDocument();
    });

    it('renders avatar image when avatar is present', () => {
        renderWithProvider(
            <SidebarFooterComponent user={{ name: 'Ana García', email: 'ana@example.com', avatar: 'https://example.com/avatar.png' }} />,
        );

        const img = screen.getByAltText('Ana García');
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
    });

    it('keeps identity text truncated and constrained for narrow viewports', () => {
        renderWithProvider(
            <SidebarFooterComponent user={{ name: 'A very long name that should not overflow the narrow container', email: 'a.very.long.email.address@example.com', avatar: undefined }} />,
        );

        const nameSpan = screen.getByText('A very long name that should not overflow the narrow container');
        const emailSpan = screen.getByText('a.very.long.email.address@example.com');

        expect(nameSpan.className).toContain('truncate');
        expect(emailSpan.className).toContain('truncate');

        const textContainer = nameSpan.closest('div');
        expect(textContainer?.className).toContain('min-w-0');
    });
});
