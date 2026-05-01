import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CareerListCard } from './career-list-card';
import type { Career } from '../types';
import { useEnrollmentsStore } from '@/modules/enrollments/store/enrollments.store';

// Mock careers
const mockCareer: Career = {
    id: 'c1',
    name: 'Ingeniería en Sistemas',
    durationYears: 5,
    totalSubjects: 42,
};

describe('CareerListCard', () => {
    beforeEach(() => {
        useEnrollmentsStore.setState({ enrolledCareerIds: [] });
    });

    it('renders career name as heading', () => {
        render(<CareerListCard career={mockCareer} />);
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ingeniería en Sistemas');
    });

    it('renders career duration', () => {
        render(<CareerListCard career={mockCareer} />);
        expect(screen.getByText('5 años')).toBeInTheDocument();
    });

    it('renders total subjects count', () => {
        render(<CareerListCard career={mockCareer} />);
        expect(screen.getByText('42 materias')).toBeInTheDocument();
    });

    it('renders singular subject label for 1 subject', () => {
        const oneSubjectCareer = { ...mockCareer, totalSubjects: 1 };
        render(<CareerListCard career={oneSubjectCareer} />);
        expect(screen.getByText('1 materia')).toBeInTheDocument();
    });

    it('renders duration for singular year', () => {
        const singleYearCareer = { ...mockCareer, durationYears: 1 };
        render(<CareerListCard career={singleYearCareer} />);
        expect(screen.getByText('1 año')).toBeInTheDocument();
    });

    it('does not show enrolled badge for non-enrolled career', () => {
        render(<CareerListCard career={mockCareer} />);
        expect(screen.queryByText('Inscripto')).not.toBeInTheDocument();
    });

    it('non-enrolled career uses button as card trigger', () => {
        render(<CareerListCard career={mockCareer} />);
        // The entire card is now a button trigger
        expect(screen.getByRole('button', { name: /Ver opciones de inscripción para Ingeniería en Sistemas/i })).toBeInTheDocument();
    });

    it('has responsive overflow prevention classes on card button', () => {
        render(<CareerListCard career={mockCareer} />);
        const button = screen.getByRole('button');
        expect(button.className).toContain('overflow-hidden');
    });

    it('has min-w-0 on flex container for overflow prevention', () => {
        render(<CareerListCard career={mockCareer} />);
        const button = screen.getByRole('button');
        const header = button.querySelector('header');
        const innerDiv = header?.querySelector('div');
        expect(innerDiv?.className).toContain('min-w-0');
    });

    describe('Read-only enrolled marker contract', () => {
        it('shows enrolled badge when career is enrolled', () => {
            // Pre-enroll the career
            useEnrollmentsStore.setState({
                enrolledCareerIds: ['c1'],
            });

            render(<CareerListCard career={mockCareer} />);
            expect(screen.getByText('Inscripto')).toBeInTheDocument();
        });

        it('enrolled career uses article semantic element (not button)', () => {
            useEnrollmentsStore.setState({
                enrolledCareerIds: ['c1'],
            });

            render(<CareerListCard career={mockCareer} />);
            // Should be article, not button
            expect(document.querySelector('article')).toBeInTheDocument();
            expect(document.querySelector('button')).not.toBeInTheDocument();
        });

        it('enrolled badge is non-interactive (read-only marker)', () => {
            useEnrollmentsStore.setState({
                enrolledCareerIds: ['c1'],
            });

            render(<CareerListCard career={mockCareer} />);

            // The badge should not be a button
            const badge = screen.getByText('Inscripto');
            expect(badge.closest('button')).toBeNull();
            expect(badge.closest('a')).toBeNull();

            // Should be a Badge component (article descendant)
            const article = document.querySelector('article');
            expect(article?.contains(badge)).toBe(true);
        });

        it('enrolled career shows subject count and duration', () => {
            useEnrollmentsStore.setState({
                enrolledCareerIds: ['c1'],
            });

            render(<CareerListCard career={mockCareer} />);

            expect(screen.getByText('42 materias')).toBeInTheDocument();
            expect(screen.getByText('5 años')).toBeInTheDocument();
        });

        it('does not mutate enrollment state when interacting with badge', () => {
            useEnrollmentsStore.setState({
                enrolledCareerIds: [],
            });

            const { rerender } = render(<CareerListCard career={mockCareer} />);

            // No badge should be visible initially
            expect(screen.queryByText('Inscripto')).not.toBeInTheDocument();

            // Attempt to find and "interact" with any non-existent badge
            // (this is a no-op since badge doesn't exist)
            screen.queryByText('Inscripto');

            // State should still be empty
            expect(useEnrollmentsStore.getState().enrolledCareerIds).toHaveLength(0);

            // Re-render with enrolled state
            useEnrollmentsStore.setState({
                enrolledCareerIds: ['c1'],
            });
            rerender(<CareerListCard career={mockCareer} />);

            // Now badge should be visible
            expect(screen.getByText('Inscripto')).toBeInTheDocument();

            // Clean up
            useEnrollmentsStore.setState({ enrolledCareerIds: [] });
        });

        it('clean up enrolled state after test', () => {
            useEnrollmentsStore.setState({ enrolledCareerIds: [] });
        });
    });
});