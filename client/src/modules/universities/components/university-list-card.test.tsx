import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UniversityListCard } from './university-list-card';

describe('UniversityListCard', () => {
    it('renders university name', () => {
        render(<UniversityListCard name="Universidad Nacional de La Plata" careersCount={12} />);
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Universidad Nacional de La Plata');
    });

    it('renders careers count for plural', () => {
        render(<UniversityListCard name="Universidad Nacional de La Plata" careersCount={12} />);
        expect(screen.getByText('12 carreras')).toBeInTheDocument();
    });

    it('renders careers count for singular', () => {
        render(<UniversityListCard name="Universidad Nacional de La Plata" careersCount={1} />);
        expect(screen.getByText('1 carrera')).toBeInTheDocument();
    });

    describe('Avatar fallback initials', () => {
        it('renders avatar with correct initials for multi-word university name', () => {
            render(<UniversityListCard name="Universidad Nacional de La Plata" careersCount={12} />);

            // AvatarFallback should render "UN" (first chars of first two words)
            const avatarFallback = document.querySelector('[data-slot="avatar-fallback"]');
            expect(avatarFallback).toBeInTheDocument();
            expect(avatarFallback).toHaveTextContent('UN');
        });

        it('renders avatar with correct initials for single-word university name', () => {
            render(<UniversityListCard name="MIT" careersCount={8} />);

            // AvatarFallback should render "MI" (first two chars)
            const avatarFallback = document.querySelector('[data-slot="avatar-fallback"]');
            expect(avatarFallback).toBeInTheDocument();
            expect(avatarFallback).toHaveTextContent('MI');
        });

        it('renders avatar fallback with correct initials for short two-word name', () => {
            render(<UniversityListCard name="UBA" careersCount={5} />);

            // "UBA" is single word, so gets first two chars "UB"
            const avatarFallback = document.querySelector('[data-slot="avatar-fallback"]');
            expect(avatarFallback).toBeInTheDocument();
            expect(avatarFallback).toHaveTextContent('UB');
        });
    });

    describe('Responsive overflow prevention', () => {
        it('card header uses min-w-0 to prevent flex child overflow', () => {
            render(<UniversityListCard name="Universidad Nacional de La Plata" careersCount={12} />);
            const card = document.querySelector('article');
            const innerDiv = card?.querySelector('header > div:nth-child(2)');
            expect(innerDiv?.className).toContain('min-w-0');
        });

        it('university name heading has truncate class for text overflow', () => {
            render(<UniversityListCard name="Universidad Nacional de La Plata" careersCount={12} />);
            const heading = document.querySelector('h2');
            expect(heading?.className).toContain('truncate');
        });

        it('badge has shrink-0 to prevent badge compression on narrow screens', () => {
            render(<UniversityListCard name="Universidad Nacional de La Plata" careersCount={12} />);
            const badge = document.querySelector('[data-slot="badge"]');
            expect(badge?.className).toContain('shrink-0');
        });

        it('card header does not overflow with very long university names', () => {
            render(<UniversityListCard name="Universidad Nacional de Ingeniería y Ciencias Aplicadas de la Patagonia" careersCount={5} />);
            const card = document.querySelector('article');
            const header = card?.querySelector('header');
            expect(header?.className).toContain('flex');
            // The inner flex container must not overflow (overflow-hidden on the wrapper prevents it)
            const innerDiv = header?.querySelector('div');
            expect(innerDiv?.className).toContain('overflow-hidden');
        });

        it('heading has truncate and parent prevents overflow with long names', () => {
            render(<UniversityListCard name="Universidad Nacional de Ingeniería y Ciencias Aplicadas de la Patagonia" careersCount={5} />);
            const heading = document.querySelector('h2');
            expect(heading?.className).toContain('truncate');
            // Parent div has overflow-hidden to clip text at container boundary
            expect(heading?.parentElement?.className).toContain('overflow-hidden');
        });
    });

    describe('Badge visibility on long titles', () => {
        it('badge remains visible and rendered even with very long university names', () => {
            render(<UniversityListCard name="Universidad Nacional de Ingeniería y Ciencias Aplicadas de la Patagonia" careersCount={5} />);
            const badge = document.querySelector('[data-slot="badge"]');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveTextContent('5 carreras');
        });

        it('badge is not pushed out of card with maximum length university name', () => {
            render(<UniversityListCard name="Universidad Nacional de Ingeniería y Ciencias Aplicadas de la Patagonia Sur" careersCount={99} />);
            const badge = document.querySelector('[data-slot="badge"]');
            expect(badge).toBeInTheDocument();
            // Badge text should be fully visible
            expect(badge).toHaveTextContent('99 carreras');
        });

        it('card article has overflow-hidden to clip any overflow from children', () => {
            render(<UniversityListCard name="Universidad Nacional de La Plata con Carreras de Prueba Extremadamente Largas" careersCount={12} />);
            const card = document.querySelector('article');
            expect(card?.className).toContain('overflow-hidden');
        });

        it('header uses flex layout to properly space avatar, title, and badge', () => {
            render(<UniversityListCard name="Universidad Nacional de La Plata" careersCount={12} />);
            const header = document.querySelector('header');
            expect(header?.className).toContain('flex');
            expect(header?.className).toContain('items-center');
            expect(header?.className).toContain('gap-3');
        });

        it('title div has min-w-0 to allow flex child to shrink properly', () => {
            render(<UniversityListCard name="Universidad Nacional de La Plata" careersCount={12} />);
            const titleDiv = document.querySelector('header > div:nth-child(2)');
            expect(titleDiv?.className).toContain('min-w-0');
        });
    });
});
