/**
 * Centralized breadcrumb label registry for authenticated routes.
 * Derives from sidebar items and extended for nested routes.
 */
export const ROUTE_LABELS: Record<string, string> = {
    '/': 'Inicio',
    '/progress': 'Progreso',
    '/universities': 'Universidades',
    '/calendar': 'Calendario',
    '/profile': 'Perfil',
    '/profile/edit': 'Editar perfil',
    '/enrollments': 'Inscripciones',
};

/**
 * Get breadcrumb label for a given pathname.
 * Falls back to a humanized version of the path if not in registry.
 */
export function getRouteLabel(pathname: string): string {
    return ROUTE_LABELS[pathname] ?? fallbackLabel(pathname);
}

function fallbackLabel(pathname: string): string {
    const segments = pathname.replace(/^\//, '').split('/');
    if (segments.length === 1) {
        return segments[0].replace(/-/g, ' ') || 'Inicio';
    }
    return segments[segments.length - 1].replace(/-/g, ' ') || 'Inicio';
}