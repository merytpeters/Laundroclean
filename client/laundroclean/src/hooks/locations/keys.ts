import { GetLocationListParams, GetLocationParams } from "src/types/location/location";

export const serviceAreaKeys =  {
    all: ["serviceAreas"] as const,
    lists: () => ["serviceAreas", "list"] as const,
    list: (
        params?: GetLocationListParams | GetLocationParams
    ) => ["serviceAreas", "list", params] as const,
    detail: (id: string) => ["serviceArea", id] as const,
}