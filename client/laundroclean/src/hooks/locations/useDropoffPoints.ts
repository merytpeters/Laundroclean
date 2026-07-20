import { useQuery } from '@tanstack/react-query';
import { apiRequest } from 'src/lib/api/requests';
import { mockDropoffPoints } from 'src/services/locations/mock';

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
            
            if (!response.success) {
                return mockDropoffPoints;
            }
            
            return response.data?.data || mockDropoffPoints;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};

export type ValidDropoffPoint = DropoffPoint & {
  lat: number;
  lng: number;
};

export const isValidPoint = (
  point: DropoffPoint | null
): point is ValidDropoffPoint => {
  return (
    point != null &&
    point.lat != null &&
    point.lng != null
  );
};
