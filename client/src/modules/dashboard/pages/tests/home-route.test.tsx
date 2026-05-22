import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Routes } from 'react-router';
import { UserRoutes } from '@/core/router/user.route';

// Mock pity.svg icon
vi.mock('@/assets/icons', () => ({
    Pity: () => <span data-testid="pity-icon" aria-hidden="true" />,
}));

/**
 * Router-level integration test exercising real UserRoutes with / path.
 * This test proves the actual route tree correctly wires / to HomePage,
 * replacing the placeholder "Dashboard" text.
 */
describe('Home route integration', () => {
    it('renders HomePage when navigating to / via UserRoutes', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // MobilePageHeader "Inicio" has been removed per latest spec update
        expect(screen.queryByText('Inicio')).not.toBeInTheDocument();

        // Wireframe sections are present (except QuickActions which was removed)
        expect(screen.getByText('Resumen académico')).toBeInTheDocument();
        expect(screen.queryByText('Estado del Alumno')).not.toBeInTheDocument();
        expect(screen.queryByText('Tareas pendientes')).not.toBeInTheDocument();
        // QuickActions section removed - "Acceso Rápido" should not appear
        expect(screen.queryByText('Acceso Rápido')).not.toBeInTheDocument();

        // Wireframe KPI cards - "Carreras activas" appears in KPI section AND careers section
        const carrerasActivasAll = screen.getAllByText('Carreras activas');
        expect(carrerasActivasAll).toHaveLength(2);
        expect(screen.getAllByText('Facultades inscriptas')).toHaveLength(1);
        expect(screen.getAllByText('Materias en curso')).toHaveLength(1);
        expect(screen.getAllByText('Materias aprobadas')).toHaveLength(1);
    });

    it('proves the route element is HomePage, not the placeholder', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // If this were the old placeholder, we'd see "Dashboard"
        // Proving it's HomePage by checking for specific page content
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
        expect(screen.getByText('Resumen académico')).toBeInTheDocument();
    });

    it('renders at / path, not at other routes', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Verify we're on dashboard home, not universities
        expect(screen.getByText('Resumen académico')).toBeInTheDocument();
        expect(screen.queryByText('Universidades')).not.toBeInTheDocument();
    });
});

/**
 * Layout consistency tests for HomePage within the authenticated layout.
 */
describe('HomePage layout consistency', () => {
    it('renders welcome header with user name', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('¡Bienvenido, Usuario!')).toBeInTheDocument();
    });

    it('renders wireframe sections in a vertical layout', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Academic summary is rendered
        const summaryHeading = screen.getByText('Resumen académico');
        expect(summaryHeading).toBeInTheDocument();

        // Quick actions section was removed per spec
        expect(screen.queryByText('Acceso Rápido')).not.toBeInTheDocument();
    });

    it('student status section is not rendered (removed per spec)', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        expect(screen.queryByText('Estado del Alumno')).not.toBeInTheDocument();
        expect(screen.queryByText('Tareas pendientes')).not.toBeInTheDocument();
    });
});