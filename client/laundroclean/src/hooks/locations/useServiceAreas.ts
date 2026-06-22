import { useQuery } from '@tanstack/react-query';
import { apiRequest } from 'src/lib/api';
import { mockServiceAreas } from 'src/services/locations/mock';

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
                return mockServiceAreas;
            }
            
            return response.data?.data || mockServiceAreas;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};
