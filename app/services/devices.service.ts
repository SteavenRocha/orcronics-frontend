import type { Device } from '~/types/device'
import type { QueryResponse } from '~/types/pagination'

export const devicesService = {
    getAllByArea: (areaId: string, page = 1, limit = 10, search = '') =>
        $fetch<QueryResponse<Device>>(`${useApi()}/devices/area/${areaId}?page=${page}&limit=${limit}&search=${search}`),

    create: (body: object) =>
        $fetch<Device>(`${useApi()}/devices`, { method: 'POST', body }),

    update: (id: string, body: object) =>
        $fetch<Device>(`${useApi()}/devices/${id}`, { method: 'PATCH', body }),

    remove: (id: string) =>
        $fetch(`${useApi()}/devices/${id}`, { method: 'DELETE' }),
}