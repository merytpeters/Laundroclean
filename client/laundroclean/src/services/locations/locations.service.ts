import { ApiResponse } from "src/lib/api/requests";
import { locationApi } from "src/lib/api/shared/locationApi";
import { DropOffPointPayload, DropOffPointResponse, DropOffPointsResponse, GetLocationListParams, GetLocationParams, ServiceAreaPayload, ServiceAreaResponse, ServiceAreasResponse, UpdateDropOffPointPayload } from "src/types/location/location";


export async function createDropOffPointService (payload: DropOffPointPayload): Promise<ApiResponse<DropOffPointResponse> | null> {
    const res = await locationApi.createDropOffPoint(payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function listDropOffPointsService (params?: GetLocationListParams): Promise<ApiResponse<DropOffPointsResponse> | null> {
    const res = await locationApi.listDropOffPoints(params);

    if (!res.success || !res.data ||!res.meta) return null;

    return res
}

export async function getDropOffPointByIdService (dropoffId: string, params?: GetLocationParams): Promise<ApiResponse<DropOffPointResponse> | null> {
    const res = await locationApi.getDropOffPointById(dropoffId, params);

    if (!res.success || !res.data) return null;

    return res
}

export async function updateDropOffPointByIdService (dropoffId: string, payload: UpdateDropOffPointPayload): Promise<ApiResponse<DropOffPointResponse> | null> {
    const res = await locationApi.updateDropOffPointById(dropoffId, payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function deactivateDropOffPointByIdService (dropoffId: string): Promise<ApiResponse<DropOffPointResponse> | string | null> {
    const res = await locationApi.deactivateDropOffPointById(dropoffId);

    if (!res.success || !res.data || !res.message) return null;

    return res.message
}

export async function activateDropOffPointByIdService (dropoffId: string): Promise<ApiResponse<DropOffPointResponse> | null> {
    const res = await locationApi.activateDropOffPointById(dropoffId);

    if (!res.success || !res.data) return null;

    return res
}

export async function createServiceAreaService (payload: ServiceAreaPayload): Promise<ApiResponse<ServiceAreaResponse> | null> {
    const res = await locationApi.createServiceArea(payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function listServiceAreasService (params?: GetLocationListParams): Promise<ApiResponse<ServiceAreasResponse> | null> {
    const res = await locationApi.listServiceAreas(params);

    if (!res.success || !res.data ||!res.meta) return null;

    return res
}

export async function getServiceAreaByIdService (serviceareaId: string, params?: GetLocationParams): Promise<ApiResponse<ServiceAreaResponse> | null> {
    const res = await locationApi.getServiceAreaById(serviceareaId, params);

    if (!res.success || !res.data) return null;

    return res
}

export async function updateServiceAreaByIdService (serviceareaId: string, payload: ServiceAreaPayload): Promise<ApiResponse<ServiceAreaResponse> | null> {
    const res = await locationApi.updateServiceAreaById(serviceareaId, payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function deactivateServiceAreaByIdService (serviceareaId: string): Promise<ApiResponse<ServiceAreaResponse> | string | null> {
    const res = await locationApi.deactivateServiceAreaById(serviceareaId);

    if (!res.success || !res.data || !res.message) return null;

    return res.message
}

export async function activateServiceAreaByIdService (serviceareaId: string): Promise<ApiResponse<ServiceAreaResponse> | null> {
    const res = await locationApi.activateServiceAreaById(serviceareaId);

    if (!res.success || !res.data) return null;

    return res
}