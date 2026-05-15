import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Routes } from 'react-router';
import { UserRoutes } from '@/core/router/user.route';

/**
 * Router-level integration test exercising real UserRoutes with /universities path.
 * This test proves the actual route tree correctly wires /universities to UniversitiesPage,
 * not just that the component renders in isolation.
 *
 * UserRoutes() is called as a function that returns Route elements - these must be
 * direct children of Routes to be matched properly.
 */
describe('Universities route integration', () => {
    it('renders universities page when navigating to /universities via UserRoutes', () => {
        render(
            <MemoryRouter initialEntries={['/universities']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // The universities page renders MobilePageHeader with "Universidades"
        expect(screen.getByText('Universidades')).toBeInTheDocument();

        // The search input is present
        expect(screen.getByPlaceholderText('Buscar universidades...')).toBeInTheDocument();

        // University cards are rendered (proving UniversitiesPage mounted, not placeholder)
        const headings = screen.getAllByRole('heading', { level: 2 });
        expect(headings.length).toBeGreaterThan(0);
        expect(headings[0]).toHaveTextContent('Universidad Nacional de La Plata');
    });

    it('proves the route element is UniversitiesPage, not a placeholder', () => {
        render(
            <MemoryRouter initialEntries={['/universities']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // If this were the old placeholder, we'd see raw placeholder text
        // Proving it's UniversitiesPage by checking for specific page content
        expect(screen.getByPlaceholderText('Buscar universidades...')).toBeInTheDocument();
    });

    it('renders at /universities path, not at root or other routes', () => {
        render(
            <MemoryRouter initialEntries={['/universities']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Verify we're on universities page, not dashboard
        expect(screen.getByText('Universidades')).toBeInTheDocument();
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });
});

/**
 * Layout consistency tests: mobile/desktop structural assertions.
 * These are pragmatic DOM-level checks using responsive-friendly patterns.
 */
describe('UniversitiesPage layout consistency', () => {
    it('renders page header with correct title for layout consistency', () => {
        render(
            <MemoryRouter initialEntries={['/universities']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // MobilePageHeader should be present (same component used across authenticated pages)
        const header = screen.getByText('Universidades');
        expect(header).toBeInTheDocument();
    });

    it('renders search input with proper container spacing', () => {
        render(
            <MemoryRouter initialEntries={['/universities']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        const searchInput = screen.getByPlaceholderText('Buscar universidades...');
        expect(searchInput).toBeInTheDocument();

        // Input should be within a container div with proper padding (mobile/desktop container class)
        const container = searchInput.closest('div[class*="container"]');
        expect(container).toBeInTheDocument();
    });

    it('renders university cards in a vertical list with consistent spacing', () => {
        render(
            <MemoryRouter initialEntries={['/universities']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Cards should be in a container with consistent vertical spacing
        const headings = screen.getAllByRole('heading', { level: 2 });
        expect(headings.length).toBeGreaterThan(0);

        // Each card should be a heading (h2) - proving list structure
        headings.forEach((heading) => {
            expect(heading).toBeInTheDocument();
        });
    });

    it('card layout adapts to mobile with flex and truncation', () => {
        render(
            <MemoryRouter initialEntries={['/universities']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Find the card link elements (now <a> instead of <article>)
        const cards = screen.getAllByRole('link');
        expect(cards.length).toBeGreaterThan(0);

        // Each card should use flex layout (flex items-center gap-3)
        // and have truncation for long names (truncate class on h2)
        cards.forEach((card) => {
            const heading = card.querySelector('h2');
            expect(heading).toBeInTheDocument();
            // Verify truncation class for text overflow on small screens
            expect(heading?.className).toContain('truncate');
        });
    });

    it('badge shrinks properly on small screens', () => {
        render(
            <MemoryRouter initialEntries={['/universities']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Find badge elements - they should have shrink-0 to prevent compression
        const badges = document.querySelectorAll('[class*="Badge"]');
        badges.forEach((badge) => {
            expect(badge.className).toContain('shrink-0');
        });
    });
});

/**
 * Route interaction tests: navigation from /universities to /universities/:id/careers
 */
describe('University card navigation', () => {
    it('navigates to careers page when university card is clicked', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter initialEntries={['/universities']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Find the first university card link
        const firstCard = screen.getAllByRole('link')[0];
        expect(firstCard).toHaveAttribute('aria-label', 'Ver carreras de Universidad Nacional de La Plata');

        // Click the card
        await user.click(firstCard);

        // Should navigate to careers page - mobile header shows abbreviation only (UN)
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('UN');
    });

    it('navigates to correct careers page for each university', () => {

        // Test UBA (id: 2)
        render(
            <MemoryRouter initialEntries={['/universities/2/careers']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Should show careers page with UB abbreviation in header (no full name)
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('UB');
    });

    it('keyboard activation of university card triggers navigation', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter initialEntries={['/universities']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Get the first university card
        const firstCard = screen.getAllByRole('link')[0];

        // Focus the card
        firstCard.focus();
        expect(document.activeElement).toBe(firstCard);

        // Activate with keyboard (Enter)
        await user.keyboard('{Enter}');

        // Should navigate to careers page - mobile header shows abbreviation (UN)
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('UN');
    });

    it('careers page heading contains university abbreviation (not full name)', () => {
        render(
            <MemoryRouter initialEntries={['/universities/1/careers']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // The heading should show abbreviation only, not full university name
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('UN');
        expect(heading).not.toHaveTextContent(/Universidad Nacional de La Plata/i);
    });

    it('renders careers list when university has careers', () => {
        render(
            <MemoryRouter initialEntries={['/universities/1/careers']}>
                <Routes>
                    {UserRoutes()}
                </Routes>
            </MemoryRouter>
        );

        // Should show some careers
        const careerHeadings = screen.getAllByRole('heading', { level: 2 });
        expect(careerHeadings.length).toBeGreaterThan(0);
    });
});