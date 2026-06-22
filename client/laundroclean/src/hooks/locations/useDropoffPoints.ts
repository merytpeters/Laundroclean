import { useQuery } from '@tanstack/react-query';
import { apiRequest } from 'src/lib/api';

export interface DropoffPoint {
    id: string;
    name: string;
    address: string;
    lat: number | null;
    lng: number | null;
    isActive: boolean;
}

export interface DropoffPointsResponse {
    data: DropoffPoint[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

export const useDropoffPoints = () => {
    return useQuery({
        queryKey: ['dropoffPoints'],
        queryFn: async () => {
            const response = await apiRequest<DropoffPointsResponse>('dropoffPoints');
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            return response.data?.data || [];
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};
