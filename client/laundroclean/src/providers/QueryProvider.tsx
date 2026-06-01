'use client';

import {
    QueryClientProvider,
} from '@tanstack/react-query';
import { queryClient } from 'src/lib/query-client';

export default function QueryProvider({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}