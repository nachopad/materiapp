import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CareerStats } from './career-stats';
import type { Career } from '../types';

function mockCareer(overrides?: Partial<Career>): Career {
    return {
        id: '1',
        name: 'Test Career',
        universityName: 'Test University',
        progress: 50,
        approved: 10,
        regular: 5,
        pending: 5,
        average: 8.5,
        subjects: [],
        ...overrides,
    };
}

describe('CareerStats', () => {
    it('renders five badges in order: Aprobadas, Cursando, Promedio, Porcentaje, Pendientes', () => {
        render(<CareerStats career={mockCareer()} />);
        const badges = screen.getAllByRole('generic').filter((el) => el.className.includes('badge'));
        // getAllByRole('generic') is too broad; instead query by text fragments
        const aprobadas = screen.getByText(/10 Aprobadas/);
        const cursando = screen.getByText(/5 Cursando/);
        const promedio = screen.getByText(/8\.5 Promedio/);
        const porcentaje = screen.getByText(/50% Porcentaje/);
        const pendientes = screen.getByText(/5 Pendientes/);

        expect(aprobadas).toBeInTheDocument();
        expect(cursando).toBeInTheDocument();
        expect(promedio).toBeInTheDocument();
        expect(porcentaje).toBeInTheDocument();
        expect(pendientes).toBeInTheDocument();
    });

    it('renders correct values for zero counts', () => {
        render(
            <CareerStats
                career={mockCareer({ approved: 0, regular: 0, pending: 0, progress: 0, average: 0 })}
            />,
        );
        expect(screen.getByText(/0 Aprobadas/)).toBeInTheDocument();
        expect(screen.getByText(/0 Cursando/)).toBeInTheDocument();
        expect(screen.getByText(/0 Promedio/)).toBeInTheDocument();
        expect(screen.getByText(/0% Porcentaje/)).toBeInTheDocument();
        expect(screen.getByText(/0 Pendientes/)).toBeInTheDocument();
    });
});
