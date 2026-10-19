import { adminApi } from "src/lib/api/adminApi";
import { PromoCodePayload, UpdatePromoCodePayload } from "src/types/laundrocleanServices/promoCode";
import { PromoCodeDto } from "src/types/laundrocleanServices/promoCode.dto";
import { ApiResponse } from "src/lib/api/requests";

export async function adminCreatePromoCodeService (payload: PromoCodePayload): Promise<ApiResponse<PromoCodeDto> | null> {
    const res = await adminApi.createPromoCode(payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function adminGetPromoCodeListService (): Promise<ApiResponse<PromoCodeDto[]> | null> {
    const res = await adminApi.getPromoCodes();

    if (!res.success || !res.data) return null;

    return res
}

export async function adminGetPromoCodeByIdService (id: string): Promise<ApiResponse<PromoCodeDto> | null> {
    const res = await adminApi.getPromoCodeById(id);

    if (!res.success || !res.data) return null;

    return res
}

export async function adminUpdatePromoCodeById (id: string, payload: UpdatePromoCodePayload): Promise<ApiResponse<PromoCodeDto> | null> {
    const res = await adminApi.updatePromoCodeById(id, payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function adminDeactivatePromoCodeById (id: string): Promise<ApiResponse<string> | null> {
    const res = await adminApi.deactivatePromoCodeById(id);

    if (!res.success || !res.message) return null;

    return res
}

export async function adminReactivatePromoCodeById (id: string): Promise<ApiResponse<PromoCodeDto> | null> {
    const res = await adminApi.reactivatePromoCodeById(id);

    if (!res.success || !res.message) return null;

    return res
}
