import { ServicePriceDto } from "src/types/laundrocleanServices/laundrocleanservices.dto"
import { apiRequest } from "../requests"
import { ServicePricePayload } from "src/types/laundrocleanServices/laundroservices"


export const servicePriceApi = {
    createServicePrice: (serviceId: string, payload: ServicePricePayload) =>
        apiRequest<ServicePriceDto>(`/service-price/${serviceId}`, {
            method: "POST",
            body: JSON.stringify(payload),
        })
}