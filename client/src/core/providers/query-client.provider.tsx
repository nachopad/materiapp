import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

interface QueryClientProviderProps {
    children: ReactNode;
}

export function QueryClientProvider({ children }: QueryClientProviderProps) {
    return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>;
}
