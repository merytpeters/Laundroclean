import { adminApi } from "src/lib/api/adminApi";
import { PromoCodePayload, UpdatePromoCodePayload } from "src/types/laundrocleanServices/promoCode";
import { PromoCodeDto } from "src/types/laundrocleanServices/promoCode.dto";

export async function adminCreatePromoCodeService (payload: PromoCodePayload): Promise<PromoCodeDto | null> {
    const res = await adminApi.createPromoCode(payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminGetPromoCodeListService (): Promise<PromoCodeDto[] | null> {
    const res = await adminApi.getPromoCodes();

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminGetPromoCodeByIdService (id: string): Promise<PromoCodeDto | null> {
    const res = await adminApi.getPromoCodeById(id);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminUpdatePromoCodeById (id: string, payload: UpdatePromoCodePayload): Promise<PromoCodeDto | null> {
    const res = await adminApi.updatePromoCodeById(id, payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminDeactivatePromoCodeById (id: string): Promise<string | null> {
    const res = await adminApi.deactivatePromoCodeById(id);

    if (!res.success || !res.message) return null;

    return res.message
}
