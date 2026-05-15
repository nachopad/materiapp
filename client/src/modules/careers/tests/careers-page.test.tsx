import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Routes } from 'react-router';
import { UserRoutes } from '@/core/router/user.route';

// Utility to set viewport size for responsive tests
const setViewport = (width: number, height: number) => {
    global.innerWidth = width;
    global.innerHeight = height;
    global.dispatchEvent(new Event('resize'));
};

describe('CareersPage', () => {
    it('renders careers list for valid university', () => {
        render(
            <MemoryRouter initialEntries={['/universities/1/careers']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { level: 2, name: 'Ingeniería en Sistemas' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Licenciatura en Administración' })).toBeInTheDocument();
    });

    it('renders search input for filtering careers', () => {
        render(
            <MemoryRouter initialEntries={['/universities/1/careers']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        const searchInput = screen.getByPlaceholderText('Buscar carreras...');
        expect(searchInput).toBeInTheDocument();
    });

    it('renders careers as list items with semantic markup', () => {
        render(
            <MemoryRouter initialEntries={['/universities/1/careers']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Check ul element exists with proper aria-label
        const list = screen.getByRole('list');
        expect(list).toHaveAttribute('aria-label', expect.stringContaining('carreras'));

        // Check li elements - university 1 has 6 careers in mock data
        const listItems = screen.getAllByRole('listitem');
        expect(listItems.length).toBe(6);
    });

    it('shows card trigger buttons for non-enrolled careers', () => {
        render(
            <MemoryRouter initialEntries={['/universities/1/careers']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Cards are now buttons that open popover for enrollment
        const cardTriggers = screen.getAllByRole('button', { name: /Ver opciones de inscripción/ });
        expect(cardTriggers.length).toBeGreaterThan(0);
    });

    describe('Mobile header with abbreviation', () => {
        it('renders only abbreviation text in mobile header title without avatar', () => {
            render(
                <MemoryRouter initialEntries={['/universities/1/careers']}>
                    <Routes>
                        {UserRoutes()}
                    </Routes>
                </MemoryRouter>
            );

            // Check that header title shows "UN" abbreviation only
            const headerTitle = document.querySelector('.fixed.top-0 h1');
            expect(headerTitle).toBeInTheDocument();
            expect(headerTitle).toHaveTextContent('UN');

            // Ensure no avatar initials appear in header
            const avatarFallback = document.querySelector('[data-slot="avatar-fallback"]');
            expect(avatarFallback).not.toBeInTheDocument();
        });

        it('renders correct abbreviation for different universities without avatar', () => {
            // University 2: Universidad de Buenos Aires -> "UB" (skips "de")
            render(
                <MemoryRouter initialEntries={['/universities/2/careers']}>
                    <Routes>
                        {UserRoutes()}
                    </Routes>
                </MemoryRouter>
            );

            const headerTitle = document.querySelector('.fixed.top-0 h1');
            expect(headerTitle).toHaveTextContent('UB');

            // No avatar should be present
            const avatarFallback = document.querySelector('[data-slot="avatar-fallback"]');
            expect(avatarFallback).not.toBeInTheDocument();
        });

        it('renders single-word university abbreviation without avatar', () => {
            // University 3: Universidad Tecnológica Nacional -> "UT"
            render(
                <MemoryRouter initialEntries={['/universities/3/careers']}>
                    <Routes>
                        {UserRoutes()}
                    </Routes>
                </MemoryRouter>
            );

            const headerTitle = document.querySelector('.fixed.top-0 h1');
            expect(headerTitle).toHaveTextContent('UT');

            // No avatar should be present
            const avatarFallback = document.querySelector('[data-slot="avatar-fallback"]');
            expect(avatarFallback).not.toBeInTheDocument();
        });
    });

    describe('390px responsive viewport', () => {
        it('does not cause horizontal overflow at 390px width', () => {
            // Store original dimensions
            const originalInnerWidth = global.innerWidth;
            const originalInnerHeight = global.innerHeight;

            // Set to 390px width (typical mobile viewport)
            setViewport(390, 844);

            try {
                render(
                    <MemoryRouter initialEntries={['/universities/1/careers']}>
                        <Routes>
                            {UserRoutes()}
                        </Routes>
                    </MemoryRouter>
                );

                // Check the document body for overflow
                const body = document.body;
                const hasHorizontalOverflow = body.scrollWidth > body.clientWidth;

                // Also check the main container
                const container = document.querySelector('.container');
                if (container) {
                    const containerRect = container.getBoundingClientRect();
                    // At 390px, container should fit without overflow
                    expect(containerRect.right).toBeLessThanOrEqual(390);
                }

                expect(hasHorizontalOverflow).toBe(false);
            } finally {
                // Restore original dimensions
                setViewport(originalInnerWidth, originalInnerHeight);
            }
        });

        it('careers page content remains readable at narrow viewport', () => {
            const originalInnerWidth = global.innerWidth;
            setViewport(390, 844);

            try {
                render(
                    <MemoryRouter initialEntries={['/universities/1/careers']}>
                        <Routes>
                            {UserRoutes()}
                        </Routes>
                    </MemoryRouter>
                );

                // Search input should still be present and visible
                const searchInput = screen.getByPlaceholderText('Buscar carreras...');
                expect(searchInput).toBeInTheDocument();

                // Career list should be visible
                const list = screen.getByRole('list');
                expect(list).toBeInTheDocument();

                // At least one career card should be visible
                const listItems = screen.getAllByRole('listitem');
                expect(listItems.length).toBeGreaterThan(0);
            } finally {
                setViewport(originalInnerWidth, 600);
            }
        });
    });
});
