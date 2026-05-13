import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Sidebar } from '../sidebar';

// Mock window.matchMedia before any imports that use it
beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
});

// Partial mock - preserve most icons, mock ones causing issues
vi.mock('lucide-react', async () => {
    const actual = await vi.importActual('lucide-react');
    return {
        ...actual,
        // Mock icons that cause issues with test environment
        Home: () => <span data-testid="icon-home">Home</span>,
        ChartLine: () => <span data-testid="icon-chart">ChartLine</span>,
        University: () => <span data-testid="icon-uni">University</span>,
        Calendar: () => <span data-testid="icon-cal">Calendar</span>,
        Loader2: () => <span data-testid="icon-loader">Loader2</span>,
        Check: () => <span data-testid="icon-check">Check</span>,
        MoonIcon: () => <span data-testid="icon-moon">Moon</span>,
        SunIcon: () => <span data-testid="icon-sun">Sun</span>,
        Bell: () => <span data-testid="icon-bell">Bell</span>,
        CreditCard: () => <span data-testid="icon-credit">CreditCard</span>,
        LogOut: () => <span data-testid="icon-logout">LogOut</span>,
        UserCircle: () => <span data-testid="icon-user-circle">UserCircle</span>,
        PanelLeftIcon: () => <span data-testid="icon-panel">PanelLeftIcon</span>,
        User: () => <span data-testid="icon-user">User</span>,
        BarChart: () => <span data-testid="icon-bar">BarChart</span>,
        GraduationCap: () => <span data-testid="icon-grad">GraduationCap</span>,
        FileText: () => <span data-testid="icon-file">FileText</span>,
        Sparkles: () => <span data-testid="icon-sparkles">Sparkles</span>,
        BookOpen: () => <span data-testid="icon-book">BookOpen</span>,
        Trophy: () => <span data-testid="icon-trophy">Trophy</span>,
        ChevronDown: () => <span data-testid="icon-chevron-down">ChevronDown</span>,
        ChevronRight: () => <span data-testid="icon-chevron-right">ChevronRight</span>,
        X: () => <span data-testid="icon-x">X</span>,
    };
});

// Mock Avatar components to avoid external image loading issues
vi.mock('@/shared/components/ui/avatar', () => ({
    Avatar: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className} data-testid="avatar">{children}</div>
    ),
    AvatarImage: ({ alt }: { alt?: string }) => <span data-testid="avatar-image" aria-label={alt} />,
    AvatarFallback: ({ children }: { children: React.ReactNode }) => <span data-testid="avatar-fallback">{children}</span>,
}));

// Mock next-themes to avoid hydration issues
vi.mock('next-themes', () => ({
    useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

// Mock @/assets/icons to avoid SVG parsing issues
vi.mock('@/assets/icons', () => ({
    Materiapp: () => <span data-testid="materiapp-icon">Materiapp</span>,
}));

/**
 * Helper to get breadcrumb listitems specifically.
 * The breadcrumb is inside a nav with data-slot="breadcrumb" inside the header.
 */
function getBreadcrumbItems(container: HTMLElement) {
    const breadcrumbNav = container.querySelector('nav[data-slot="breadcrumb"]');
    if (!breadcrumbNav) return [];
    return Array.from(breadcrumbNav.querySelectorAll('li'));
}

/**
 * Tests for breadcrumb behavior at `/` vs other routes.
 * At `/`: breadcrumb should show ONLY "Inicio" (no previous item, no duplicate).
 * At other routes: breadcrumb should show "Inicio > [RouteLabel]".
 */
describe('Sidebar breadcrumb at root', () => {
    it('shows only "Inicio" at root path without duplicate', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/']}>
                <Sidebar />
            </MemoryRouter>
        );

        const breadcrumbItems = getBreadcrumbItems(container);
        // At root: only 1 item (Inicio link), no separator + page
        expect(breadcrumbItems).toHaveLength(1);

        // The single item should be a link to "/"
        const link = breadcrumbItems[0]?.querySelector('a');
        expect(link).toHaveAttribute('href', '/');
        expect(link).toHaveTextContent('Inicio');
    });

    it('does not duplicate "Inicio" in breadcrumb at root path', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/']}>
                <Sidebar />
            </MemoryRouter>
        );

        // Get ONLY breadcrumb "Inicio" - scope to breadcrumb nav
        const breadcrumbNav = container.querySelector('nav[data-slot="breadcrumb"]');
        const breadcrumbInicioElements = Array.from(breadcrumbNav?.querySelectorAll('a') || [])
            .filter(a => a.textContent === 'Inicio');

        // Should only have ONE "Inicio" link in the breadcrumb
        expect(breadcrumbInicioElements).toHaveLength(1);
    });
});

describe('Sidebar breadcrumb at other routes', () => {
    it('shows "Inicio > [Label]" at /progress', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/progress']}>
                <Sidebar />
            </MemoryRouter>
        );

        const breadcrumbItems = getBreadcrumbItems(container);
        // Should have 3 items: "Inicio" link, separator (icon), and "Progreso" page
        expect(breadcrumbItems).toHaveLength(3);

        // First item should be "Inicio" link
        const inicioLink = breadcrumbItems[0]?.querySelector('a');
        expect(inicioLink).toHaveAttribute('href', '/');
        expect(inicioLink).toHaveTextContent('Inicio');

        // Third item should be "Progreso" page (BreadcrumbPage, not a link)
        expect(breadcrumbItems[2]).toHaveTextContent('Progreso');
    });

    it('shows "Inicio > [Label]" at /universities', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/universities']}>
                <Sidebar />
            </MemoryRouter>
        );

        const breadcrumbItems = getBreadcrumbItems(container);
        expect(breadcrumbItems).toHaveLength(3);

        // Third item should be "Universidades"
        expect(breadcrumbItems[2]).toHaveTextContent('Universidades');
    });

    it('dynamically shows correct label for nested routes', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/profile/edit']}>
                <Sidebar />
            </MemoryRouter>
        );

        const breadcrumbItems = getBreadcrumbItems(container);
        expect(breadcrumbItems).toHaveLength(3);

        // Third item should be "Editar perfil"
        expect(breadcrumbItems[2]).toHaveTextContent('Editar perfil');
    });
});