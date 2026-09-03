import type { DropoffPoint } from "src/hooks/locations/useDropoffPoints";
import type { ServiceAreasResponse } from "src/types/location/location";

export const mockServiceAreas: ServiceAreasResponse = [
  {
    id: "1",
    name: "Ikeja Axis",
    isActive: true,
    latMin: 6.58,
    latMax: 6.63,
    lngMin: 3.3,
    lngMax: 3.39,
  },
  {
    id: "2",
    name: "Yaba Corridor",
    isActive: true,
    latMin: 6.49,
    latMax: 6.54,
    lngMin: 3.35,
    lngMax: 3.43,
  },
  {
    id: "3",
    name: "Lekki Extension",
    isActive: false,
    latMin: 6.41,
    latMax: 6.47,
    lngMin: 3.45,
    lngMax: 3.55,
  },
];

export const mockDropoffPoints: DropoffPoint[] = [
  {
    id: "1",
    name: "Ikeja Drop-Off",
    address: "12 Awolowo Way, Ikeja, Lagos",
    lat: 6.596,
    lng: 3.349,
    isActive: true,
  },
  {
    id: "2",
    name: "Yaba Drop-Off",
    address: "8 Herbert Macaulay Way, Yaba, Lagos",
    lat: 6.516,
    lng: 3.379,
    isActive: true,
  },
  {
    id: "3",
    name: "Lekki Drop-Off",
    address: "19 Admiralty Way, Lekki Phase 1, Lagos",
    lat: 6.436,
    lng: 3.451,
    isActive: false,
  },
];