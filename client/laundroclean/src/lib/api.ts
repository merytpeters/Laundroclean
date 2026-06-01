export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: { 'Content-Type': 'application/json', ...options?.headers },
            ...options,
        });

        if (!response.ok) {
            const errorText = await response.text()
            return {
                data: null,
                error: errorText || `Error: ${response.status} ${response.statusText}`
            };
        }

        if (response.status === 204) {
            return {
                data: null,
                error: 'No content',
            };
        }

        const data = (await response.json()) as T;
        return {
            data,
            error: null,
        };
    } catch(err) {
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Unknown error'
        };
    }
}