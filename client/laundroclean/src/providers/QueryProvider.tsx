'use client';

import {
    QueryClientProvider,
} from '@tanstack/react-query';
import { queryClient } from 'src/lib/query-client';
import { Toaster } from 'sonner';

export default function QueryProvider({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" />
        </QueryClientProvider>
    )
}