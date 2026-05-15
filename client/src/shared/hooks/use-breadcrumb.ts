import { useLocation } from 'react-router';
import { getRouteLabel } from '@/shared/lib/breadcrumb';

/**
 * Hook that returns the breadcrumb label for the current pathname.
 * Used by the desktop sidebar to dynamically display route labels.
 */
export function useBreadcrumbLabel(): string {
    const location = useLocation();
    return getRouteLabel(location.pathname);
}