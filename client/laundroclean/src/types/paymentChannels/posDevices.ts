export type POSDevicePayload = {
    name?: string;
    serialNumber: string;
}

export type UpdatePOSDevicePayload = {
    name?: string;
    serialNumber: string;
    isActive?: boolean;
}

export type RestorePOSDevicePayload = {
    name?: string;
    serialNumber: string;
    isActive: boolean; // in use set to true
}