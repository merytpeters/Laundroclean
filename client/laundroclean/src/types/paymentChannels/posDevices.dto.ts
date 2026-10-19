export type POSDeviceDto = {
    id: string;
    isActive: boolean;
    name: string | null;
    serialNumber: string;
    createdAt: string;
    updatedAt: string;
}

export type POSDevicesDto = POSDeviceDto[]