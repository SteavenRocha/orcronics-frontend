export interface Area {
    id: string
    name: string
    description: string | null
    createdAt: string
    _count?: { devices: number }
}