"use client";

import { useEffect, useState } from "react";
import { SelectOption } from "src/components/ui/Forms/AuthForms";

export function useRoles () {
    const [data, setData] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() =>{
            setData([
                {label: "Admin", value: "admin"},
                {label: "Staff", value: "staff"},
            ]);
            setLoading(false)
        }, 500);
        return () => clearTimeout(timeout);
    }, [])
    return { data, loading}
}