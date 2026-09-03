import { Meta } from "src/types/shared";
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth-store";

export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message?: string;
    meta?: Meta | null;
}

interface CustomRequestInit extends RequestInit {
    params?: Record<string, unknown> | object;
    skipAuthRetry?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const refreshAccessToken = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const json = await response.json() as ApiResponse<{ accessToken: string }>;

        if (!response.ok || !json.success || !json.data?.accessToken) {
            clearAccessToken();
            return false;
        }

        setAccessToken(json.data.accessToken);
        return true;
    } catch (_err) {
        clearAccessToken();
        return false;
    }
};

export async function apiRequest<T>(
    endpoint: string,
    options?: CustomRequestInit,
): Promise<ApiResponse<T>> {
    try {

        const params = options?.params;

        const fetchOptions  = {...options};
        delete fetchOptions.params;

        const cleanEndpoint = endpoint.replace(/^\/+/, "");
        let url = `${BASE_URL}/${cleanEndpoint}`;
        const token = getAccessToken();

        if (params) {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, val]) => val !== undefined && val !== null)
            );
            const queryString = new URLSearchParams(cleanParams as Record<string, string>).toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }

        // log outgoing request body to help diagnose issues
        // console.log('[apiRequest] request body', fetchOptions?.body);

        const response = await fetch(url, {
            ...fetchOptions,
            credentials: 'include',
            headers: {
                ...(fetchOptions?.body instanceof FormData ? {} : {
                    'Content-Type': 'application/json',
                }),
                ...(token && {
                    Authorization: `Bearer ${token}`
                }),
                ...fetchOptions?.headers,
            },
        });

        // log request and response for easier debugging
        // console.log('[apiRequest] ', fetchOptions?.method ?? 'GET', url);
        const respText = await response.clone().text();
        //console.log('[apiRequest] response', response.status, respText);

        let json: ApiResponse<T>;
        try {
            json = respText ? JSON.parse(respText) : { success: false, data: null, message: 'No response body' } as ApiResponse<T>;
        } catch (parseErr) {
            json = await response.json();
        }

        if (!response.ok) {
            const shouldRetryWithRefresh =
                response.status === 401 &&
                !!token &&
                !fetchOptions.skipAuthRetry &&
                cleanEndpoint !== 'auth/refresh';

            if (shouldRetryWithRefresh) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    return apiRequest<T>(endpoint, {
                        ...options,
                        skipAuthRetry: true,
                    });
                }
            }

            throw new Error(json.message || "Request failed");
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