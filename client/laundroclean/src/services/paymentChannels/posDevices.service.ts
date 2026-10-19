import { ApiResponse } from "src/lib/api/requests";
import { posDeviceApi } from "src/lib/api/shared/paymentChannels/posDevicesApi";
import { POSDeviceDto, POSDevicesDto } from "src/types/paymentChannels/posDevices.dto";
import { POSDevicePayload, UpdatePOSDevicePayload, RestorePOSDevicePayload } from "src/types/paymentChannels/posDevices";
import { ByActiveParam } from "src/types/pagination";


export async function createPOSDeviceService (payload: POSDevicePayload): Promise<ApiResponse<POSDeviceDto> | null> {
    const res = await posDeviceApi.createPOSDevice(payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function listPOSDevicesService (params?: ByActiveParam): Promise<ApiResponse<POSDevicesDto> | null> {
    const res = await posDeviceApi.listPOSDevices(params);

    if (!res.success || !res.data || !res.meta) return null;

    return res
}

export async function updatePOSDeviceService (payload: UpdatePOSDevicePayload): Promise<ApiResponse<POSDeviceDto> | null> {
    const res = await posDeviceApi.updatePOSDevice(payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function restorePOSDeviceService (payload: RestorePOSDevicePayload): Promise<ApiResponse<POSDeviceDto> | null> {
    const res = await posDeviceApi.restorePOSDevice(payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function getPOSDeviceByIdService (id: string): Promise<ApiResponse<POSDeviceDto> | null> {
    const res = await posDeviceApi.getPOSDeviceById(id);

    if (!res.success || !res.data) return null;

    return res
}

export async function softDeletePOSDeviceService (id: string): Promise<ApiResponse<POSDeviceDto> | null> {
    const res = await posDeviceApi.softDeletePOSDevice(id);

    if (!res.success || !res.data) return null;

    return res
}