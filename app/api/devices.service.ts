import type { Device } from '~/types/device'
import type { QueryResponse } from '~/types/pagination'

export function useDevicesService() {
    const { $api } = useNuxtApp()

    return {
        getAllByArea: (areaId: string, page = 1, limit = 10, search = '') =>
            $api<QueryResponse<Device>>(`/devices/area/${areaId}?page=${page}&limit=${limit}&search=${search}`),

        create: (body: object) =>
            $api<Device>(`/devices`, {
                method: 'POST',
                body
            }),

        update: (id: string, body: object) =>
            $api<Device>(`/devices/${id}`, {
                method: 'PATCH',
                body
            }),

        remove: (id: string) =>
            $api(`/devices/${id}`, {
                method: 'DELETE'
            }),
    }
}