import { AllServicesParams, PublicServicesParams, GetActiveServicesParams } from "src/types/laundrocleanServices/laundroservices"

export const laundrocleanServicesKeys = {
    all: ["services"] as const,
    lists: () => ["services", "list"] as const,
    
    list: (
        params?: AllServicesParams | PublicServicesParams | GetActiveServicesParams
    ) => ["services", "list", params] as const,

    detail: (id: string) => ["service", id] as const
}