import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { UniversityListCard } from './university-list-card';

// Helper to render with router
const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('UniversityListCard', () => {
    it('renders university name', () => {
        renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Universidad Nacional de La Plata');
    });

    it('renders careers count for plural', () => {
        renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);
        expect(screen.getByText('12 carreras')).toBeInTheDocument();
    });

    it('renders careers count for singular', () => {
        renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={1} />);
        expect(screen.getByText('1 carrera')).toBeInTheDocument();
    });

    describe('Avatar fallback initials', () => {
        it('renders avatar with correct initials for multi-word university name', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);

            const avatarFallback = document.querySelector('[data-slot="avatar-fallback"]');
            expect(avatarFallback).toBeInTheDocument();
            expect(avatarFallback).toHaveTextContent('UN');
        });

        it('renders avatar with correct initials for single-word university name', () => {
            renderWithRouter(<UniversityListCard id="1" name="MIT" careersCount={8} />);

            const avatarFallback = document.querySelector('[data-slot="avatar-fallback"]');
            expect(avatarFallback).toBeInTheDocument();
            expect(avatarFallback).toHaveTextContent('MI');
        });

        it('renders avatar fallback with correct initials for short two-word name', () => {
            renderWithRouter(<UniversityListCard id="1" name="UBA" careersCount={5} />);

            const avatarFallback = document.querySelector('[data-slot="avatar-fallback"]');
            expect(avatarFallback).toBeInTheDocument();
            expect(avatarFallback).toHaveTextContent('UB');
        });
    });

    describe('Responsive overflow prevention', () => {
        it('card wrapper uses overflow-hidden to prevent overflow', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);
            const link = document.querySelector('a');
            expect(link?.className).toContain('overflow-hidden');
        });

        it('university name heading has truncate class for text overflow', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);
            const heading = document.querySelector('h2');
            expect(heading?.className).toContain('truncate');
        });

        it('badge has shrink-0 to prevent badge compression on narrow screens', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);
            const badge = document.querySelector('[data-slot="badge"]');
            expect(badge?.className).toContain('shrink-0');
        });

        it('inner div has min-w-0 to allow flex child to shrink properly', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);
            const header = document.querySelector('header');
            const innerDiv = header?.querySelector('div');
            expect(innerDiv?.className).toContain('min-w-0');
        });

        it('heading has truncate and parent prevents overflow with long names', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de Ingeniería y Ciencias Aplicadas de la Patagonia" careersCount={5} />);
            const heading = document.querySelector('h2');
            expect(heading?.className).toContain('truncate');
            expect(heading?.parentElement?.className).toContain('overflow-hidden');
        });
    });

    describe('Keyboard activation', () => {
        it('renders as an anchor element that is keyboard focusable', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);
            const link = document.querySelector('a');
            expect(link).toBeInTheDocument();

            // Anchor elements are naturally keyboard focusable
            expect(link?.tabIndex).toBe(0);
        });

        it('renders anchor with correct href for careers navigation', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);
            const link = document.querySelector('a');
            expect(link).toHaveAttribute('href', '/universities/1/careers');
        });

        it('has accessible label describing the navigation intent', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);
            const link = document.querySelector('a');
            expect(link).toHaveAttribute('aria-label', 'Ver carreras de Universidad Nacional de La Plata');
        });

        it('has semantic heading inside anchor context', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);
            const link = document.querySelector('a');
            expect(link?.querySelector('h2')).toBeInTheDocument();
        });
    });

    describe('Badge visibility on long titles', () => {
        it('badge remains visible and rendered even with very long university names', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de Ingeniería y Ciencias Aplicadas de la Patagonia" careersCount={5} />);
            const badge = document.querySelector('[data-slot="badge"]');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveTextContent('5 carreras');
        });

        it('badge is not pushed out of card with maximum length university name', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de Ingeniería y Ciencias Aplicadas de la Patagonia Sur" careersCount={99} />);
            const badge = document.querySelector('[data-slot="badge"]');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveTextContent('99 carreras');
        });

        it('header uses flex layout to properly space avatar, title, and badge', () => {
            renderWithRouter(<UniversityListCard id="1" name="Universidad Nacional de La Plata" careersCount={12} />);
            const header = document.querySelector('header');
            expect(header?.className).toContain('flex');
            expect(header?.className).toContain('items-center');
            expect(header?.className).toContain('gap-3');
        });
    });
});