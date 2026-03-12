import type { Area } from '~/types/area'
import type { QueryResponse } from '~/types/pagination'

export function useAreasService() {
    const { $api } = useNuxtApp()

    return {
        getAllByBranch: (branchId: string, page = 1, limit = 10, search = '') =>
            $api<QueryResponse<Area>>(`/areas/branch/${branchId}?page=${page}&limit=${limit}&search=${search}`),

        getOne: (id: string) =>
            $api<Area>(`/areas/${id}`),

        create: (body: object) =>
            $api<Area>(`/areas`, {
                method: 'POST',
                body
            }),

        update: (id: string, body: object) =>
            $api<Area>(`/areas/${id}`, {
                method: 'PATCH',
                body
            }),

        remove: (id: string) =>
            $api(`/areas/${id}`, {
                method: 'DELETE'
            }),
    }
}  