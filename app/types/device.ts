export interface Device {
    id: string
    name: string
    type: string
    serial: string | null
    username: string | null
    password: string | null
    notes: string | null
    createdAt: string
    metadata: DeviceMetadata[] | null
}

export interface DeviceMetadata {
    id: string
    field: string
    value: string
}