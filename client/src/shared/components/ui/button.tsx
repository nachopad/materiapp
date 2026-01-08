import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, type LucideIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive:
                    'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/90',
                outline:
                    'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2 has-[>svg]:px-3',
                sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
                lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
                icon: 'size-9',
                'icon-sm': 'size-8',
                'icon-lg': 'size-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    fullWidth?: boolean;
    /** Accepts a LucideIcon component or a ReactNode (e.g., custom SVG) */
    icon?: LucideIcon | React.ReactNode;
    iconPosition?: 'left' | 'right';
    loadingIcon?: LucideIcon;
    loading?: boolean;
}

function Button({
    className,
    variant,
    size,
    fullWidth,
    asChild = false,
    icon,
    iconPosition = 'left',
    loadingIcon: LoadingIcon = Loader2,
    loading = false,
    disabled,
    children,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : 'button';

    const renderIcon = () => {
        if (loading) {
            return <LoadingIcon className="h-4 w-4 animate-spin" />;
        }
        if (!icon) {
            return null;
        }
        // Check if icon is a React component (LucideIcon) or a ReactNode (JSX element)
        if (typeof icon === 'function') {
            const IconComponent = icon as LucideIcon;
            return <IconComponent className="h-4 w-4" />;
        }
        // It's already a ReactNode (e.g., <GoogleIcon />)
        return icon;
    };

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }), fullWidth && 'w-full')}
            disabled={disabled || loading}
            {...props}
        >
            {iconPosition === 'left' && renderIcon()}
            {children}
            {iconPosition === 'right' && renderIcon()}
        </Comp>
    );
}

export { Button, buttonVariants };
