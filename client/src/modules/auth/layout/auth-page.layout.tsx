import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { UniversityFooter } from '../components/university-footer';
import { Pity } from '@/assets/icons';

interface AuthPageLayoutProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export function AuthPageLayout({ children, className, ...props }: AuthPageLayoutProps) {
    return (
        <main className={cn('min-h-screen w-full grid lg:grid-cols-2', className)} {...props}>
            {/* Left Panel - Desktop Only */}
            <aside className="hidden lg:flex flex-col justify-between bg-secondary p-10 text-muted-foreground dark:border-r m-4 rounded-xl">
                <h1 className="text-primary text-center">Materiapp</h1>

                <figure className="flex flex-col items-center justify-center gap-4">
                    <Pity className="size-45" />

                    {/* Graph Placeholder */}
                    <div className="flex items-center gap-4 opacity-50" aria-hidden="true">
                        <div className="h-12 w-12 rounded-full bg-current/20" />
                        <div className="h-1 w-16 bg-current/20" />
                        <div className="h-12 w-12 rounded-full bg-current/20" />
                        <div className="h-1 w-16 bg-current/20" />
                        <div className="h-12 w-12 rounded-full bg-current/20" />
                    </div>
                </figure>

                <UniversityFooter size="sm" className="opacity-100" />
            </aside>

            {/* Right Panel - Form */}
            <section className="flex flex-col items-center justify-center p-4 md:p-8">
                <article className="w-full max-w-md space-y-8">{children}</article>

                {/* Mobile Footer */}
                <UniversityFooter size="md" className="mt-8 flex-col lg:hidden" />
            </section>
        </main>
    );
}
