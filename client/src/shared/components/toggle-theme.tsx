import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '../lib/utils';
import { Button, type ButtonProps } from './ui/button';
import { TooltipComponent } from './ui/tooltip';

interface ToggleThemeProps extends ButtonProps {
    className?: string;
}

export function ToggleTheme({ className, ...props }: ToggleThemeProps) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <TooltipComponent text={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
            <Button
                className={cn(className)}
                variant="ghost"
                size="icon-sm"
                onClick={toggleTheme}
                aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                {...props}
            >
                {isDark ? <SunIcon /> : <MoonIcon />}
            </Button>
        </TooltipComponent>
    );
}
