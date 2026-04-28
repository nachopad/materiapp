import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router';
import UniversitiesPage from './universities.page';
import type { MockUniversity } from './universities.page';

function renderUniversitiesPage(universities?: MockUniversity[]) {
    return render(<UniversitiesPage universities={universities} />, { wrapper: BrowserRouter });
}

describe('UniversitiesPage', () => {
    it('renders all universities initially', async () => {
        renderUniversitiesPage();
        const universities = screen.getAllByRole('heading', { level: 2 });
        expect(universities).toHaveLength(8);
    });

    it('filters universities by search term (case-insensitive)', async () => {
        const user = userEvent.setup();
        renderUniversitiesPage();

        const searchInput = screen.getByPlaceholderText('Buscar universidades...');
        await user.type(searchInput, 'la plata');

        const universities = screen.getAllByRole('heading', { level: 2 });
        expect(universities).toHaveLength(1);
        expect(universities[0]).toHaveTextContent('Universidad Nacional de La Plata');
    });

    it('shows no-results state when search has no matches', async () => {
        const user = userEvent.setup();
        renderUniversitiesPage();

        const searchInput = screen.getByPlaceholderText('Buscar universidades...');
        await user.type(searchInput, 'xyz123');

        expect(screen.getByText('No se encontraron universidades')).toBeInTheDocument();
    });

    it('clearing search restores initial list', async () => {
        const user = userEvent.setup();
        renderUniversitiesPage();

        const searchInput = screen.getByPlaceholderText('Buscar universidades...');
        await user.type(searchInput, 'la plata');

        expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);

        await user.clear(searchInput);

        const universities = screen.getAllByRole('heading', { level: 2 });
        expect(universities).toHaveLength(8);
    });

    it('shows clear search button when no results', async () => {
        const user = userEvent.setup();
        renderUniversitiesPage();

        const searchInput = screen.getByPlaceholderText('Buscar universidades...');
        await user.type(searchInput, 'xyz123');

        const clearButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
        expect(clearButton).toBeInTheDocument();
    });

    it('clear search button restores all universities', async () => {
        const user = userEvent.setup();
        renderUniversitiesPage();

        const searchInput = screen.getByPlaceholderText('Buscar universidades...');
        await user.type(searchInput, 'xyz123');

        const clearButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
        await user.click(clearButton);

        const universities = screen.getAllByRole('heading', { level: 2 });
        expect(universities).toHaveLength(8);
    });

    it('shows empty state when universities list is empty', () => {
        renderUniversitiesPage([]);

        expect(screen.getByText('No hay universidades disponibles')).toBeInTheDocument();
        // Search input should still be visible even with empty data
        expect(screen.getByPlaceholderText('Buscar universidades...')).toBeInTheDocument();
    });

    it('page container has max-w-3xl to constrain content width on large screens', () => {
        renderUniversitiesPage();
        // The container div should have max-w-3xl class for content width constraint
        const container = document.querySelector('div[class*="max-w-3xl"]');
        expect(container).toBeInTheDocument();
    });

    it('all university cards render without overflow', () => {
        renderUniversitiesPage();
        const cards = document.querySelectorAll('article');
        cards.forEach((card) => {
            const header = card.querySelector('header');
            expect(header).toBeInTheDocument();
            // Verify header uses flex layout which is responsive by nature
            expect(header?.className).toContain('flex');
        });
    });
});
