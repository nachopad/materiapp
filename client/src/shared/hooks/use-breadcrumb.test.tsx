import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import { useBreadcrumbLabel } from '@/shared/hooks/use-breadcrumb';

// Component that exposes the hook value for testing
function BreadcrumbLabelConsumer() {
    const label = useBreadcrumbLabel();
    return <span data-testid="breadcrumb-label">{label}</span>;
}

describe('useBreadcrumbLabel', () => {
    it('renders "Inicio" at root path', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <BreadcrumbLabelConsumer />
            </MemoryRouter>
        );
        expect(screen.getByTestId('breadcrumb-label')).toHaveTextContent('Inicio');
    });

    it('renders "Progreso" at /progress', () => {
        render(
            <MemoryRouter initialEntries={['/progress']}>
                <BreadcrumbLabelConsumer />
            </MemoryRouter>
        );
        expect(screen.getByTestId('breadcrumb-label')).toHaveTextContent('Progreso');
    });

    it('renders "Universidades" at /universities', () => {
        render(
            <MemoryRouter initialEntries={['/universities']}>
                <BreadcrumbLabelConsumer />
            </MemoryRouter>
        );
        expect(screen.getByTestId('breadcrumb-label')).toHaveTextContent('Universidades');
    });

    it('renders different labels for different routes', () => {
        // Test /calendar route
        render(
            <MemoryRouter initialEntries={['/calendar']}>
                <BreadcrumbLabelConsumer />
            </MemoryRouter>
        );
        expect(screen.getByTestId('breadcrumb-label')).toHaveTextContent('Calendario');
    });

    it('falls back to humanized label for unknown routes', () => {
        render(
            <MemoryRouter initialEntries={['/some-unknown-path']}>
                <BreadcrumbLabelConsumer />
            </MemoryRouter>
        );
        expect(screen.getByTestId('breadcrumb-label')).toHaveTextContent('some unknown path');
    });
});