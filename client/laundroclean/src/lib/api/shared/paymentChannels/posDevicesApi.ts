import { ByActiveParam } from "src/types/pagination";
import { apiRequest } from "../../requests";
import { POSDevicePayload, RestorePOSDevicePayload, UpdatePOSDevicePayload } from "src/types/paymentChannels/posDevices";
import { POSDeviceDto, POSDevicesDto } from "src/types/paymentChannels/posDevices.dto";

export const posDeviceApi = {
    createPOSDevice: (payload: POSDevicePayload) =>
        apiRequest<POSDeviceDto>("/posdevices", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    listPOSDevices: (params?: ByActiveParam) =>
        apiRequest<POSDevicesDto>("/posdevices", {
            method: "GET",
            params: params,
        }),

    updatePOSDevice: (payload: UpdatePOSDevicePayload) =>
        apiRequest<POSDeviceDto>("/posdevices", {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),

    restorePOSDevice: (payload: RestorePOSDevicePayload) =>
        apiRequest<POSDeviceDto>("/posdevices/restore", {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),

    getPOSDeviceById: (id: string) =>
        apiRequest<POSDeviceDto>(`/posdevices/${id}`),

    softDeletePOSDevice: (id: string) =>
        apiRequest<POSDeviceDto>(`/posdevices/${id}`, {
            method: "PATCH",
        }),
}