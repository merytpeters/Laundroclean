import { adminApi } from "src/lib/api/adminApi";
import { clientApi } from "src/lib/api/clientApi";
import { publicApi } from "src/lib/api/shared/publicApi";
import { servicePriceApi } from "src/lib/api/shared/servicePriceApi";
import { staffApi } from "src/lib/api/staffApi";
import { ServiceDto, ServicesDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";
import { ActivateOrDeactivateServicesPayload, ServicesResponse, AllServicesParams, ActivatedOrDeactivatedServicesResponse, GetActiveServicesParams, ServicePayload, ServicePricePayload, ServicePriceResponse, ServiceResponse, UpdateServicePayload, PublicServicesParams } from "src/types/laundrocleanServices/laundroservices";
import { ApiResponse } from "src/lib/api/requests";

export async function createServicePriceService(serviceId: string, payload: ServicePricePayload): Promise<ApiResponse<ServicePriceResponse> | null> {
  const res = await servicePriceApi.createServicePrice(serviceId, payload);

  if (!res.success || !res.data) return null;

  return res
}

// Admin ApiServices
export async function adminCreateLCServiceService(payload: ServicePayload, servicePrice?: ServicePricePayload): Promise<ApiResponse<ServiceResponse> | null> {
  const res = await adminApi.createService(payload);

  if (!res.success || !res.data) return null;

  const {data, ...rest} = res

  const {prices, ...service} = data
  const serviceId = res.data.id
  if (servicePrice) {
    const finalPricePayload = {
      ...servicePrice,
      serviceId: serviceId
    }

    const servicepriceRes = await createServicePriceService(serviceId, finalPricePayload);
    if (!servicepriceRes || ! servicepriceRes.data) return null;

    const { data: servicePriceData, ...apires} = servicepriceRes;

    const updatedService = {
      ...service,
      prices: servicePriceData
    }

    return {
      ...rest,
      data: updatedService
    }
  }
  return res
}

export async function adminGetActiveServicesService(params?: GetActiveServicesParams): Promise<ApiResponse<ServicesResponse> | null> {
  const res = await adminApi.getActiveServices(params);

  if (!res.success || !res.data || !res.meta) return null;

  return res
}

export async function adminGetActiveServiceByIdService(serviceId: string): Promise<ApiResponse<ServiceResponse> | null> {
  const res = await adminApi.getActiveServiceById(serviceId);

  if (!res.success || !res.data) return null;

  return res
}

export async function adminUpdateServceByIdService(serviceId: string, payload: UpdateServicePayload): Promise<ApiResponse<ServiceResponse> | null> {
  const res = await adminApi.updateServiceById(serviceId, payload);

  if (!res.success || !res.data) return null;

  return res
}

export async function adminSearchAllServicesService(params?: AllServicesParams): Promise<ApiResponse<ServicesResponse> | null> {
  const res = await adminApi.searchAllServices(params);

  if (!res.success || !res.data || !res.meta) return null;

  return res
}

export async function adminDeactivateMultipleServices(payload: ActivateOrDeactivateServicesPayload): Promise<ApiResponse<ActivatedOrDeactivatedServicesResponse> | null> {
  const res = await adminApi.deactivateServices(payload);

  if (!res.success || !res.data) return null;

  return res
}

export async function adminGetActiveorInactiveServiceByIdServices(serviceId: string): Promise<ApiResponse<ServicesResponse> | null> {
  const res = await adminApi.getInactiveOrActiveServiceById(serviceId)
  
  if (!res.success || !res.data) return null;

  return res
}

export async function adminRestoreServiceById(serviceId: string): Promise<ApiResponse<ServiceResponse> | null> {
  const res = await adminApi.restoreServiceById(serviceId);

  if (!res.success || !res.data) return null;

  return res
}

export async function adminRestoreMuulitpleServices(payload: ActivateOrDeactivateServicesPayload): Promise<ApiResponse<ActivatedOrDeactivatedServicesResponse> | null> {
  const res = await adminApi.restoreMultipleServices(payload);

  if (!res.success || !res.data) return null;

  return res
}

// client ApiServices

export async function clientGetServicesService(params?: GetActiveServicesParams): Promise<ApiResponse<ServicesResponse> | null> {
  const res = await clientApi.getServices(params);

  if (!res.success || !res.data || !res.meta) return null;

  return res
}

export async function clientGetServiceByIdService(id: string): Promise<ApiResponse<ServiceResponse> | null> {
  const res = await clientApi.getServiceById(id);

  if (!res.success || !res.data) return null;

  return res
}


// Public Service Page Service
export async function publicGetServicesService (params?: PublicServicesParams): Promise<ApiResponse<ServicesDto> | null> {
  const res = await publicApi.getAndSearchServices(params);

  if (!res.success || !res.data) return null;

  return res
}

export async function publicGetServiceById (id: string): Promise<ApiResponse<ServiceDto> | null> {
  const res = await publicApi.getServiceById(id);

  if (!res.success || !res.data) return null;

  return res
}


// Staff API services
export async function staffCreateLCServiceService(payload: ServicePayload, servicePrice?: ServicePricePayload): Promise<ApiResponse<ServiceResponse> | null> {
  const res = await staffApi.createService(payload);

  if (!res.success || !res.data) return null;

  const {data, ...rest} = res

  const {prices, ...services} = data

  const serviceId = res.data.id
  if (servicePrice) {
    const finalPricePayload = {
      ...servicePrice,
      serviceId: serviceId
    }

    const servicepriceRes = await createServicePriceService(serviceId, finalPricePayload);
    if (!servicepriceRes || !servicepriceRes.data) return null;

    const {data: servicepriceData, ...apires} = servicepriceRes;

    const updatedService = {
      ...services,
      prices: servicepriceData
    }

    return {
      ...rest,
      data: updatedService
    }
  }
  return res
}

export async function staffGetActiveServicesService(params?: GetActiveServicesParams): Promise<ApiResponse<ServicesResponse> | null> {
  const res = await staffApi.getActiveServices(params);

  if (!res.success || !res.data || !res.meta) return null;

  return res
}

export async function staffGetActiveServiceByIdService(serviceId: string): Promise<ApiResponse<ServiceResponse> | null> {
  const res = await staffApi.getActiveServiceById(serviceId);

  if (!res.success || !res.data) return null;

  return res
}

export async function staffUpdateServceByIdService(serviceId: string, payload: UpdateServicePayload): Promise<ApiResponse<ServiceResponse> | null> {
  const res = await staffApi.updateServiceById(serviceId, payload);

  if (!res.success || !res.data) return null;

  return res
}


