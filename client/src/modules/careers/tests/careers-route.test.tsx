import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Routes } from 'react-router';
import { UserRoutes } from '@/core/router/user.route';

describe('CareersRoute', () => {
    it('renders careers page when navigating to /universities/:id/careers', () => {
        render(
            <MemoryRouter initialEntries={['/universities/1/careers']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Should show the back button and search
        expect(screen.getByPlaceholderText('Buscar carreras...')).toBeInTheDocument();
    });

    it('renders careers list for valid university via route', () => {
        render(
            <MemoryRouter initialEntries={['/universities/1/careers']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Check career items are rendered
        const headings = screen.getAllByRole('heading', { level: 2 });
        expect(headings.length).toBeGreaterThan(0);
    });

    it('renders error state for invalid university id', () => {
        render(
            <MemoryRouter initialEntries={['/universities/invalid-id/careers']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/No se encontró la universidad/i)).toBeInTheDocument();
    });
});