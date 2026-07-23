import { Meta } from "../shared";

export type DropoffPointDto = {
    name: string;
    address: string;
    id: string;
    lat?: number;
    lng?: number;
    isActive: boolean;
}

export type DropoffPointsDto = DropoffPointDto[] & Meta

export type ServiceAreaDto = {
    name: string;
    id: string;
    isActive: boolean;
    latMin?: number;
    latMax?: number;
    lngMin?: number;
    lngMax?: number;
}

export type ServiceAreasDto = ServiceAreaDto[] & Meta