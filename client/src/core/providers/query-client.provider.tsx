import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { queryClient } from './query-client';

interface QueryClientProviderProps {
    children: ReactNode;
}

export function QueryClientProvider({ children }: QueryClientProviderProps) {
    return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>;
}
