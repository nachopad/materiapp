import { ToggleTheme } from '@/shared/components/toggle-theme';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { TooltipComponent } from './ui/tooltip';

interface MobilePageHeaderProps {
    title: string;
    backHref?: string;
    showThemeToggle?: boolean;
    className?: string;
}

/**
 * Reusable mobile-only fixed header with centered title.
 * Optionally shows a back button on the left and theme toggle on the right.
 */
export function MobilePageHeader({ title, backHref, showThemeToggle = true, className }: MobilePageHeaderProps) {
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
                        <Button
                            variant="outline"
                            size="icon-sm"
                            className="absolute left-4 dark:bg-background dark:border-border/25"
                            aria-label="Volver"
                        >
                            <Link to={backHref} className="flex items-center justify-center w-full h-full">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                    </TooltipComponent>
                )}
                <h1 className="text-lg font-semibold tracking-wider uppercase">{title}</h1>
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
