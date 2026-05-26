'use client';

import { useEffect } from 'react';

import { useAuthStore } from '../store/auth.store';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty';
import { Loader2 } from 'lucide-react';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
    const bootstrap = useAuthStore((state) => state.bootstrap);
    const status = useAuthStore((state) => state.status);

    useEffect(() => {
        bootstrap();
    }, [bootstrap]);

    if (status === 'idle' || status === 'loading') {
        return (
            <Empty className="flex h-screen w-full items-center justify-center">
                <EmptyHeader>
                    <EmptyMedia variant="icon" className="bg-primary">
                        <Loader2
                            role="status"
                            aria-label="Cargando"
                            className="text-primary-foreground size-5 animate-spin"
                        />
                    </EmptyMedia>
                    <EmptyTitle>Procesando tu solicitud</EmptyTitle>
                    <EmptyDescription>
                        Por favor espera mientras procesamos tu solicitud. No recargues la pagina.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return <>{children}</>;
}
