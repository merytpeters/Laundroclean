import { adminApi } from "src/lib/api/adminApi";
import { clientApi } from "src/lib/api/clientApi";
import { publicApi } from "src/lib/api/shared/publicApi";
import { servicePriceApi } from "src/lib/api/shared/servicePriceApi";
import { ServiceDto, ServiceWithServicePriceAndPromoCodesDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";
import { ActivateOrDeactivateServicesPayload, ServiceWithPromoCodesAndPriceResponse, AllServicesParams, CombinedServiceandPriceResponse, ActivatedOrDeactivatedServicesResponse, GetActiveServicesParams, ServicePayload, ServicePricePayload, ServicePriceResponse, ServiceResponse, ServicesResponse, UpdateServicePayload, PublicServicesParams } from "src/types/laundrocleanServices/laundroservices";

export async function createServicePriceService(serviceId: string, payload: ServicePricePayload): Promise<ServicePriceResponse | null> {
  const res = await servicePriceApi.createServicePrice(serviceId, payload);

  if (!res.success || !res.data) return null;

  return res.data
}

// Admin ApiServices
export async function adminCreateLCServiceService(payload: ServicePayload, servicePrice?: ServicePricePayload): Promise<ServiceResponse | CombinedServiceandPriceResponse | null> {
  const res = await adminApi.createService(payload);

  if (!res.success || !res.data) return null;

  const service = res.data
  const serviceId = res.data.id
  if (servicePrice) {
    const finalPricePayload = {
      ...servicePrice,
      serviceId: serviceId
    }

    const servicepriceRes = await createServicePriceService(serviceId, finalPricePayload);
    if (!servicepriceRes) return null;

    return {
      service,
      price: servicepriceRes
    }
  }
  return res.data
}

export async function adminGetActiveServicesService(params?: GetActiveServicesParams): Promise<ServicesResponse | null> {
  const res = await adminApi.getActiveServices(params);

  if (!res.success || !res.data || !res.meta) return null;

  const serviceList = res.data
  const meta = res.meta

  return {
    services: serviceList,
    meta: meta,
  }
}

export async function adminGetActiveServiceByIdService(serviceId: string): Promise<ServiceWithPromoCodesAndPriceResponse | null> {
  const res = await adminApi.getActiveServiceById(serviceId);

  if (!res.success || !res.data) return null;

  const {prices, promoCodes, ...services} = res.data

  return {
    prices: prices,
    promoCodes: promoCodes,
    ...services
  }
}

export async function adminUpdateServceByIdService(serviceId: string, payload: UpdateServicePayload): Promise<ServiceResponse | null> {
  const res = await adminApi.updateServiceById(serviceId, payload);

  if (!res.success || !res.data) return null;

  return res.data
}

export async function adminSearchAllServicesService(params?: AllServicesParams): Promise<ServicesResponse | null> {
  const res = await adminApi.searchAllServices(params);

  if (!res.success || !res.data || !res.meta) return null;

  const servicesList = res.data;
  const meta = res.meta;

  return {
    services: servicesList,
    meta: meta
  }
}

export async function adminDeactivateMultipleServices(payload: ActivateOrDeactivateServicesPayload): Promise<ActivatedOrDeactivatedServicesResponse | null> {
  const res = await adminApi.deactivateServices(payload);

  if (!res.success || !res.data) return null;

  return res.data
}

export async function adminGetActiveorInactiveServiceByIdServices(serviceId: string): Promise<ServiceWithPromoCodesAndPriceResponse | null> {
  const res = await adminApi.getInactiveOrActiveServiceById(serviceId)
  
  if (!res.success || !res.data) return null;

  const {prices, promoCodes, ...services} = res.data

  return {
    prices: prices,
    promoCodes: promoCodes,
    ...services
  }
}

export async function adminRestoreServiceById(serviceId: string): Promise<ServiceResponse | null> {
  const res = await adminApi.restoreServiceById(serviceId);

  if (!res.success || !res.data) return null;

  return res.data
}

export async function adminRestoreMuulitpleServices(payload: ActivateOrDeactivateServicesPayload): Promise<ActivatedOrDeactivatedServicesResponse | null> {
  const res = await adminApi.restoreMultipleServices(payload);

  if (!res.success || !res.data) return null;

  return res.data
}

// client ApiServices

export async function clientGetServicesService(params?: GetActiveServicesParams): Promise<ServicesResponse | null> {
  const res = await clientApi.getServices(params);

  if (!res.success || !res.data || !res.meta) return null;

  const servicesList = res.data;
  const meta = res.meta;

  return {
    services: servicesList,
    meta: meta
  }
}

export async function clientGetServiceByIdService(id: string): Promise<ServiceWithPromoCodesAndPriceResponse | null> {
  const res = await clientApi.getServiceById(id);

  if (!res.success || !res.data) return null;

  const {prices, promoCodes, ...services} = res.data

  return {
    prices: prices,
    promoCodes: promoCodes,
    ...services
  }
}


// Public Service Page Service
export async function publicGetServicesService (params?: PublicServicesParams): Promise<ServiceWithServicePriceAndPromoCodesDto | null> {
  const res = await publicApi.getAndSearchServices(params);

  if (!res.success || !res.data) return null;

  const {prices, promoCodes, ...services} = res.data

  return {
    prices: prices,
    promoCodes: promoCodes,
    ...services
  }
}

export async function publicGetServiceById (id: string): Promise<ServiceDto | null> {
  const res = await publicApi.getServiceById(id);

  if (!res.success || !res.data) return null;

  return res.data
}
