import { AllServicesParams, PublicServicesParams, GetActiveServicesParams } from "src/types/laundrocleanServices/laundroservices"

export const laundrocleanServicesKeys = {
    services: {
        all: ["services"] as const,
        list: (
            params?: AllServicesParams | PublicServicesParams | GetActiveServicesParams
        ) => ["services", params] as const,
        detail: (id: string) => ["service", id] as const
    }
}