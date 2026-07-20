import { DropoffPointDto, DropoffPointsDto, ServiceAreaDto, ServiceAreasDto } from "src/types/location/location.dto";
import { apiRequest } from "../requests";
import { DropOffPointPayload, GetLocationListParams, GetLocationParams, ServiceAreaPayload, UpdateDropOffPointPayload } from "src/types/location/location";

export const locationApi = {
    createDropOffPoint: (payload: DropOffPointPayload) =>
        apiRequest<DropoffPointDto>('/dropoffpoint', {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    listDropOffPoints: (params?: GetLocationListParams) =>
        apiRequest<DropoffPointsDto>('/dropoffpoint', {
            params: params
        }),
    
    getDropOffPointById: (dropoffId: string, params?: GetLocationParams) =>
        apiRequest<DropoffPointDto>(`/dropoffpoint/${dropoffId}`, {
            params: params
        }),

    updateDropOffPointById: (dropoffId: string, payload: UpdateDropOffPointPayload) =>
        apiRequest<DropoffPointDto>(`/dropoffpoint/${dropoffId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    deactivateDropOffPointById: (dropoffId: string) =>
        apiRequest<DropoffPointDto | string>(`/dropoffpoint/${dropoffId}/inactive`, {
            method: "PATCH",
        }),
    
    activateDropOffPointById: (dropoffId: string) =>
        apiRequest<DropoffPointDto>(`/dropoffpoint/${dropoffId}/active`, {
            method: "PATCH",
        }),

    createServiceArea: (payload: ServiceAreaPayload) =>
        apiRequest<ServiceAreaDto>('/servicearea', {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    listServiceAreas: (params?: GetLocationListParams) =>
        apiRequest<ServiceAreasDto>('/servicearea', {
            params: params
        }),

    getServiceAreaById: (serviceareaId: string, params?: GetLocationParams) =>
        apiRequest<ServiceAreaDto>(`/servicearea/${serviceareaId}`, {
            params: params
        }),

    updateServiceAreaById: (serviceareaId: string, payload: ServiceAreaPayload) =>
        apiRequest<ServiceAreaDto>(`/servicearea/${serviceareaId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    deactivateServiceAreaById: (serviceareaId: string) =>
        apiRequest<ServiceAreaDto | string>(`/servicearea/${serviceareaId}/inactive`, {
            method: "PATCH",
        }),

    activateServiceAreaById: (serviceareaId: string) =>
        apiRequest<ServiceAreaDto>(`/servicearea/${serviceareaId}/active`, {
            method: "PATCH",
        }),
}