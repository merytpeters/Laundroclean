import { Meta } from "../shared";

export type DropOffPointPayload = {
    name: string;
    address: string;
}

export type UpdateDropOffPointPayload = {
    name?: string;
    address?: string;
}

export type GetLocationListParams = {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
}

export type DropOffPointResponse = {
    name: string;
    address: string;
    id: string;
    lat?: number;
    lng?: number;
    isActive: boolean;
}

export type DropOffPointsResponse = {
    dropoffpoints: DropOffPointResponse[];
    meta: Meta;
}

export type ServiceAreaPayload = {
    name: string;
    latMin?: number;
    latMax?: number;
    lngMin?: number;
    lngMax?: number;
}

export type GetLocationParams = {
    search?: string;
    isActive?: boolean
}

export type ServiceAreaResponse = {
    name: string;
    id: string;
    isActive: boolean;
    latMin?: number;
    latMax?: number;
    lngMin?: number;
    lngMax?: number;
}

export type ServiceAreasResponse = {
    serviceareas: ServiceAreaResponse[];
    meta: Meta;
}