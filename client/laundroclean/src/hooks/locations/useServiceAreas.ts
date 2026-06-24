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

type ValidServiceArea = ServiceArea & {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
};

export const isValidArea = (area: ServiceArea): area is ValidServiceArea => {
  return (
    area.latMin != null &&
    area.latMax != null &&
    area.lngMin != null &&
    area.lngMax != null
  );
};

export const getCenter = (area: ServiceArea) => {
  if (!isValidArea(area)) return null;

  return {
    lat: (area.latMin + area.latMax) / 2,
    lng: (area.lngMin + area.lngMax) / 2,
  };
};

export const getRadius = (area: ServiceArea) => {
  if (!isValidArea(area)) return 0;

  return (
    Math.sqrt(
      Math.pow(area.latMax - area.latMin, 2) +
      Math.pow(area.lngMax - area.lngMin, 2)
    ) * 111000
  );
};
