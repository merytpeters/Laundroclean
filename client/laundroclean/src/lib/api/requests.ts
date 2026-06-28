export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message?: string;
    meta?: T | null;
}

interface CustomRequestInit extends RequestInit {
    params?: Record<string, unknown> | object;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function apiRequest<T>(
    endpoint: string,
    options?: CustomRequestInit,
): Promise<ApiResponse<T>> {
    try {

        const params = options?.params;

        const fetchOptions  = {...options};
        delete fetchOptions.params;

        let url = `${BASE_URL}/${endpoint}`;

        if (params) {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, val]) => val !== undefined && val !== null)
            );
            const queryString = new URLSearchParams(cleanParams as Record<string, string>).toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }

        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json', ...fetchOptions?.headers },
            ...fetchOptions,
        });

        const json: ApiResponse<T> = await response.json();

        if (!response.ok) {
            return {
                success: false,
                data: null,
                message: json.message || "Request failed",
            };
        }

        if (response.status === 204) {
            return {
                success: false,
                data: null,
                message: json.message || "No content",
            };
        }

        return json
    } catch(err) {
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : "Unknown error",
        };
    }
}