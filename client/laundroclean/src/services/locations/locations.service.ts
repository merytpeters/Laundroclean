import { locationApi } from "src/lib/api/shared/locationApi";
import { DropOffPointPayload, DropOffPointResponse, DropOffPointsResponse, GetLocationListParams, GetLocationParams, ServiceAreaPayload, ServiceAreaResponse, ServiceAreasResponse, UpdateDropOffPointPayload } from "src/types/location/location";


export async function createDropOffPointService (payload: DropOffPointPayload): Promise<DropOffPointResponse | null> {
    const res = await locationApi.createDropOffPoint(payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function listDropOffPointsService (params?: GetLocationListParams): Promise<DropOffPointsResponse | null> {
    const res = await locationApi.listDropOffPoints(params);

    if (!res.success || !res.data ||!res.meta) return null;

    const dropoffpoints = res.data;
    const meta = res.meta;

    return {
        dropoffpoints: dropoffpoints,
        meta: meta
    }
}

export async function getDropOffPointByIdService (dropoffId: string, params?: GetLocationParams): Promise<DropOffPointResponse | null> {
    const res = await locationApi.getDropOffPointById(dropoffId, params);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function updateDropOffPointByIdService (dropoffId: string, payload: UpdateDropOffPointPayload): Promise<DropOffPointResponse | null> {
    const res = await locationApi.updateDropOffPointById(dropoffId, payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function deactivateDropOffPointByIdService (dropoffId: string): Promise<DropOffPointResponse | string | null> {
    const res = await locationApi.deactivateDropOffPointById(dropoffId);

    if (!res.success || !res.data || !res.message) return null;

    return res.message
}

export async function activateDropOffPointByIdService (dropoffId: string): Promise<DropOffPointResponse | null> {
    const res = await locationApi.activateDropOffPointById(dropoffId);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function createServiceAreaService (payload: ServiceAreaPayload): Promise<ServiceAreaResponse | null> {
    const res = await locationApi.createServiceArea(payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function listServiceAreasService (params?: GetLocationListParams): Promise<ServiceAreasResponse | null> {
    const res = await locationApi.listServiceAreas(params);

    if (!res.success || !res.data ||!res.meta) return null;

    const serviceareas = res.data;
    const meta = res.meta;

    return {
        serviceareas: serviceareas,
        meta: meta
    }
}

export async function getServiceAreaByIdService (serviceareaId: string, params?: GetLocationParams): Promise<ServiceAreaResponse | null> {
    const res = await locationApi.getServiceAreaById(serviceareaId, params);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function updateServiceAreaByIdService (serviceareaId: string, payload: ServiceAreaPayload): Promise<ServiceAreaResponse | null> {
    const res = await locationApi.updateServiceAreaById(serviceareaId, payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function deactivateServiceAreaByIdService (serviceareaId: string): Promise<ServiceAreaResponse | string | null> {
    const res = await locationApi.deactivateServiceAreaById(serviceareaId);

    if (!res.success || !res.data || !res.message) return null;

    return res.message
}

export async function activateServiceAreaByIdService (serviceareaId: string): Promise<ServiceAreaResponse | null> {
    const res = await locationApi.activateServiceAreaById(serviceareaId);

    if (!res.success || !res.data) return null;

    return res.data
}