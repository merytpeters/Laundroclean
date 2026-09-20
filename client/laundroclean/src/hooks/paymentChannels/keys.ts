import { ByActiveParam } from "src/types/pagination"
import { BankAccountParams } from "src/types/paymentChannels/bankAccount"

export const bankAccountKeys = {
    all: ["bankAccounts"] as const,
    lists: () => ["bankAccounts", "list"] as const,
    list: (
        params?: BankAccountParams
    ) => ["bankAccounts", "list", params] as const,
    detail: (id: string) => ["bankAccount", id] as const
}

export const posDeviceKeys = {
    all: ["posDevices"] as const,
    lists: () => ["posDevices", "list"] as const,
    list: (
        params?: ByActiveParam
    ) => ["posDevices", "list", params] as const,
    detail: (id: string) => ["posDevice", id] as const
}

export const paymentKeys = {
    all: ["payments"] as const,
    lists: () => ["payments", "list"] as const,
    list: (
        params?: ""
    ) => ["payments", "list", params] as const,
    detail: (id: string) => ["payment", id] as const
}