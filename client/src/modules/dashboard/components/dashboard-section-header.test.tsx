import { render, screen } from '@testing-library/react';
import { BookOpen } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { DashboardSectionHeader } from './dashboard-section-header';

describe('DashboardSectionHeader', () => {
    it('renders the title as an h2 heading', () => {
        render(<DashboardSectionHeader title="Resumen académico" icon={BookOpen} />);

        const heading = screen.getByRole('heading', { level: 2, name: 'Resumen académico' });

        expect(heading).toBeInTheDocument();
    });

    it('uses Profile-equivalent typography classes on the heading', () => {
        render(<DashboardSectionHeader title="Typography Test" icon={BookOpen} />);

        const heading = screen.getByRole('heading', { level: 2, name: 'Typography Test' });

        expect(heading.className).toContain('text-2xl');
        expect(heading.className).toContain('font-bold');
        expect(heading.className).toContain('tracking-normal');
    });

    it('renders an icon wrapper with primary color and reference shape', () => {
        render(<DashboardSectionHeader title="Icon Test" icon={BookOpen} />);

        const heading = screen.getByRole('heading', { level: 2, name: 'Icon Test' });
        const container = heading.parentElement;
        const svg = container?.querySelector('svg');

        expect(svg).toBeInTheDocument();

        const wrapper = svg?.parentElement;

        expect(wrapper).toBeInTheDocument();
        expect(wrapper!.className).toContain('text-primary');
        expect(wrapper!.className).toContain('bg-muted');
        expect(wrapper!.className).toContain('rounded-lg');
        expect(wrapper!.className).toContain('size-10');
    });

    it('uses overflow-safe responsive layout classes', () => {
        render(<DashboardSectionHeader title="Responsive Test" icon={BookOpen} />);

        const heading = screen.getByRole('heading', { level: 2, name: 'Responsive Test' });
        const container = heading.parentElement;

        expect(container).toBeInTheDocument();
        expect(container!.className).toContain('flex');
        expect(container!.className).toContain('min-w-0');
        expect(container!.className).toContain('gap-2');
        expect(heading.className).toContain('min-w-0');
    });
});
