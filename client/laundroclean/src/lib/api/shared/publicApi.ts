import { PublicServicesParams } from "src/types/laundrocleanServices/laundroservices";
import { apiRequest } from "../requests";
import { ServiceDto, ServicesDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";

export const publicApi = {
    getAndSearchServices: (params?: PublicServicesParams ) =>
        apiRequest<ServicesDto>('/services', {
            params: params
        }),

    getServiceById: (id: string) =>
        apiRequest<ServiceDto>(`/services/${id}`)
}