export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: { 'Content-Type': 'application/json', ...options?.headers },
            ...options,
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