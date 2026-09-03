import { Meta } from "../shared";

export type DropOffPointPayload = {
    name: string;
    address: string;
}

export type UpdateDropOffPointPayload = {
    name?: string;
    address?: string;
}

export interface GetLocationParams {
    search?: string;
    isActive?: boolean
}

export interface GetLocationListParams extends GetLocationParams {
    page?: number;
    limit?: number;
}

export type DropOffPointResponse = {
    name: string;
    address: string;
    id: string;
    lat?: number;
    lng?: number;
    isActive: boolean;
}

export type DropOffPointsResponse = DropOffPointResponse[];

export type ServiceAreaPayload = {
    name: string;
    latMin?: number;
    latMax?: number;
    lngMin?: number;
    lngMax?: number;
}

export type ServiceAreaResponse = {
    id: string;
    name: string;
    isActive: boolean;
    latMin?: number;
    latMax?: number;
    lngMin?: number;
    lngMax?: number;
}

export type ServiceAreasResponse = ServiceAreaResponse[];

export type ValidServiceArea = ServiceAreaResponse & {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
};