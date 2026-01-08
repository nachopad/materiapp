import { cn } from '@/shared/lib/utils';

interface UniversityFooterProps {
    size?: 'sm' | 'md';
    className?: string;
}

/**
 * Reusable footer component displaying the university branding.
 */
export function UniversityFooter({ size = 'md', className }: UniversityFooterProps) {
    const iconSize = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
    const textSize = size === 'sm' ? 'text-xs' : 'text-[10px]';

    return (
        <footer className={cn('flex items-center gap-2 opacity-50', className)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={iconSize}
                aria-hidden="true"
            >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className={cn('uppercase tracking-widest font-semibold', textSize)}>E-TEAM</span>
        </footer>
    );
}
