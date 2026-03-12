import type { Branch } from '~/types/branch'
import type { QueryResponse } from '~/types/pagination'

export function useBranchesService() {

    const { $api } = useNuxtApp()

    return {
        getAllByCustomer: (customerId: string, page = 1, limit = 10, search = '') =>
            $api<QueryResponse<Branch>>(`/branches/customer/${customerId}?page=${page}&limit=${limit}&search=${search}`),

        getOne: (id: string) =>
            $api<Branch>(`/branches/${id}`),

        create: (body: object) =>
            $api<Branch>(`/branches`, {
                method: 'POST',
                body
            }),

        update: (id: string, body: object) =>
            $api<Branch>(`/branches/${id}`, {
                method: 'PATCH',
                body
            }),

        remove: (id: string) =>
            $api(`/branches/${id}`, {
                method: 'DELETE'
            }),
    }
}