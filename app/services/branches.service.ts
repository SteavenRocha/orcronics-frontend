import type { Branch } from '~/types/branch'
import type { QueryResponse } from '~/types/pagination'

export const branchesService = {
    getAllByCustomer: (customerId: string, page = 1, limit = 10, search = '') =>
        $fetch<QueryResponse<Branch>>(`${useApi()}/branches/customer/${customerId}?page=${page}&limit=${limit}&search=${search}`),

    create: (body: object) =>
        $fetch<Branch>(`${useApi()}/branches`, { method: 'POST', body }),

    update: (id: string, body: object) =>
        $fetch<Branch>(`${useApi()}/branches/${id}`, { method: 'PATCH', body }),

    remove: (id: string) =>
        $fetch(`${useApi()}/branches/${id}`, { method: 'DELETE' }),
}