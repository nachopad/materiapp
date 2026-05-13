import { describe, expect, it } from 'vitest';
import { getRouteLabel, ROUTE_LABELS } from '@/shared/lib/breadcrumb';

describe('getRouteLabel', () => {
    it('returns "Inicio" for root path', () => {
        expect(getRouteLabel('/')).toBe('Inicio');
    });

    it('returns exact label for known routes', () => {
        expect(getRouteLabel('/progress')).toBe('Progreso');
        expect(getRouteLabel('/universities')).toBe('Universidades');
        expect(getRouteLabel('/calendar')).toBe('Calendario');
        expect(getRouteLabel('/profile')).toBe('Perfil');
        expect(getRouteLabel('/enrollments')).toBe('Inscripciones');
    });

    it('returns "Editar perfil" for nested route', () => {
        expect(getRouteLabel('/profile/edit')).toBe('Editar perfil');
    });

    it('humanizes unknown path segments', () => {
        expect(getRouteLabel('/some-unknown-route')).toBe('some unknown route');
    });

    it('falls back to "Inicio" for empty or root-only path', () => {
        expect(getRouteLabel('')).toBe('Inicio');
    });
});

describe('ROUTE_LABELS registry', () => {
    it('contains entry for root', () => {
        expect(ROUTE_LABELS['/']).toBe('Inicio');
    });

    it('contains all sidebar navigation routes', () => {
        expect(ROUTE_LABELS['/progress']).toBe('Progreso');
        expect(ROUTE_LABELS['/universities']).toBe('Universidades');
        expect(ROUTE_LABELS['/calendar']).toBe('Calendario');
    });

    it('falls back to humanized label for route not in registry', () => {
        // New route added to router but not yet in ROUTE_LABELS
        expect(getRouteLabel('/exams')).toBe('exams');
        expect(getRouteLabel('/grades/semester')).toBe('semester');
    });

    it('handles route recognized but missing explicit label via fallback', () => {
        // Scenario: route exists in router but was never added to ROUTE_LABELS
        // This tests the fallback path for a route that might be added later
        const unknownRoute = '/some-future-route';
        const label = getRouteLabel(unknownRoute);
        // Should NOT be empty - fallback ensures a label always exists
        expect(label).toBeTruthy();
        expect(label.length).toBeGreaterThan(0);
    });
});