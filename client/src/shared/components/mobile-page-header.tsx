import { ToggleTheme } from '@/shared/components/toggle-theme';
import { cn } from '@/shared/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { Avatar, AvatarFallback } from './ui/avatar';
import { TooltipComponent } from './ui/tooltip';

interface MobilePageHeaderProps {
    title: string;
    backHref?: string;
    showThemeToggle?: boolean;
    initials?: string;
    className?: string;
}

/**
 * Reusable mobile-only fixed header with centered title.
 * Optionally shows a back button on the left, initials avatar in the center,
 * and theme toggle on the right.
 */
export function MobilePageHeader({ title, backHref, showThemeToggle = true, initials, className }: MobilePageHeaderProps) {
    return (
        <>
            <div
                className={cn(
                    'md:hidden w-full z-10 py-3 px-4 fixed top-0 left-0 right-0 flex items-center justify-center bg-background border-b',
                    className
                )}
            >
                {backHref && (
                    <TooltipComponent text="Volver">
                        <Link
                            to={backHref}
                            className="absolute left-4 flex items-center justify-center h-9 w-9 rounded-md border border-border bg-background hover:bg-accent cursor-pointer dark:bg-background dark:border-border/25"
                            aria-label="Volver"
                        >
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </TooltipComponent>
                )}
                {initials ? (
                    <Avatar className="h-9 w-9 absolute left-1/2 -translate-x-1/2">
                        <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                ) : null}
                <h1 className={cn('text-lg font-semibold tracking-wider uppercase', initials ? 'pl-12' : '')}>{title}</h1>
                {showThemeToggle && (
                    <ToggleTheme
                        variant="outline"
                        className="absolute right-4 dark:bg-background dark:border-border/25"
                    />
                )}
            </div>
            {/* Spacer to push content below fixed header on mobile */}
            <div className="h-12 md:hidden" aria-hidden="true" />
        </>
    );
}
