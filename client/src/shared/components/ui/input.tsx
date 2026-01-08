import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

function Input({ className, type, icon: Icon, iconPosition = 'left', disabled, ...props }: InputProps) {
    const inputElement = (
        <input
            type={type}
            data-slot="input"
            disabled={disabled}
            className={cn(
                'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                Icon && iconPosition === 'left' && 'pl-9',
                Icon && iconPosition === 'right' && 'pr-9',
                className
            )}
            {...props}
        />
    );

    if (!Icon) {
        return inputElement;
    }

    return (
        <label className="relative block">
            <Icon
                className={cn(
                    'absolute top-2.5 h-4 w-4 text-muted-foreground',
                    iconPosition === 'left' && 'left-3',
                    iconPosition === 'right' && 'right-3',
                    disabled && 'text-muted-foreground/50'
                )}
                aria-hidden="true"
            />
            {inputElement}
        </label>
    );
}

export { Input };
