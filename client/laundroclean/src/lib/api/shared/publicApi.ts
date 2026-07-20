import { PublicServicesParams } from "src/types/laundrocleanServices/laundroservices";
import { apiRequest } from "../requests";
import { ServiceDto, ServiceWithServicePriceAndPromoCodesDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";

export const publicApi = {
    getAndSearchServices: (params?: PublicServicesParams ) =>
        apiRequest<ServiceWithServicePriceAndPromoCodesDto>('/services', {
            params: params
        }),

    getServiceById: (id: string) =>
        apiRequest<ServiceDto>(`/services/${id}`)
}