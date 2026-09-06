import { DropOffPointResponse, ServiceAreaResponse, ValidServiceArea, ValidDropoffPoint } from "src/types/location/location";
export const isValidArea = (area: ServiceAreaResponse): area is ValidServiceArea => {
  return (
    area.latMin != null &&
    area.latMax != null &&
    area.lngMin != null &&
    area.lngMax != null
  );
};

export const getCenter = (area: ServiceAreaResponse) => {
  if (!isValidArea(area)) return null;

  return {
    lat: (area.latMin + area.latMax) / 2,
    lng: (area.lngMin + area.lngMax) / 2,
  };
};

export const getRadius = (area: ServiceAreaResponse) => {
  if (!isValidArea(area)) return 0;

  return (
    Math.sqrt(
      Math.pow(area.latMax - area.latMin, 2) +
      Math.pow(area.lngMax - area.lngMin, 2)
    ) * 111000
  );
};

export const isValidPoint = (
  point: DropOffPointResponse | null
): point is ValidDropoffPoint => {
  return (
    point != null &&
    point.lat != null &&
    point.lng != null
  );
};