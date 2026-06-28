import { PromoDetail } from "src/types/laundrocleanServices/promocode";

export const promoDetails: PromoDetail[]  = [
    {
        id: "1",
        code: "Free Ironing",
        description: "Get 50% off specific services",
        perUserLimit: 5,
        timesUsed: 0,
        expiresAt: "2026-12-31T23:59:59Z",
        type: "PERCENTAGE",
        value: 50,
    },
    {
        id: "2",
        code: "Jolly Discount",
        description: "Get 2000 NGN off specific services kguiutuighihguihhjjhgydtdrtdytft hguytyuifuyufuyghuyuftydrtsttduyiuioxiszuisuysudysdiudytdiousydtsuidgyd suidysydosaiudhuysdthejdiuydai diuyadihcaud jhyrtt yfryttydstdytyu tyrtfyfuy",
        perUserLimit: 5,
        timesUsed: 1,
        expiresAt: "2026-12-31T23:59:59Z",
        type: "FIXED_AMOUNT",
        value: 2000,
        currency: "NAIRA"
    }
]