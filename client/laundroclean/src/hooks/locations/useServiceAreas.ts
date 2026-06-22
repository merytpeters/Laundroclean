import { useQuery } from '@tanstack/react-query';
import { apiRequest } from 'src/lib/api';

export interface ServiceArea {
    id: string;
    name: string;
    isActive: boolean;
    latMin: number | null;
    latMax: number | null;
    lngMin: number | null;
    lngMax: number | null;
}

export interface ServiceAreasResponse {
    data: ServiceArea[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

export const useServiceAreas = () => {
    return useQuery({
        queryKey: ['serviceAreas'],
        queryFn: async () => {
            const response = await apiRequest<ServiceAreasResponse>('serviceAreas');
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            return response.data?.data || [];
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};
