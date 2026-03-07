import type { Area } from '~/types/area'
import type { QueryResponse } from '~/types/pagination'

export const areasService = {
    getAllByBranch: (branchId: string, page = 1, limit = 10, search = '') =>
        $fetch<QueryResponse<Area>>(`${useApi()}/areas/branch/${branchId}?page=${page}&limit=${limit}&search=${search}`),

    create: (body: object) =>
        $fetch<Area>(`${useApi()}/areas`, { method: 'POST', body }),

    update: (id: string, body: object) =>
        $fetch<Area>(`${useApi()}/areas/${id}`, { method: 'PATCH', body }),

    remove: (id: string) =>
        $fetch(`${useApi()}/areas/${id}`, { method: 'DELETE' }),
}  