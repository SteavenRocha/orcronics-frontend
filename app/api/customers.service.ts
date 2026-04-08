import type { QueryResponse } from '~/types/pagination'
import type { Customer } from '~/types/customer'

export function useCustomersService() {
    const { $api } = useNuxtApp()

    return {
        getAll: (page = 1, limit = 10, search = '') =>
            $api<QueryResponse<Customer>>(`/customers?page=${page}&limit=${limit}&search=${search}`),

        getOne: (id: string) =>
            $api<Customer>(`/customers/${id}`),

        create: (body: object) =>
            $api<Customer>(`/customers`, {
                method: 'POST',
                body
            }),

        update: (id: string, body: object) =>
            $api<Customer>(`/customers/${id}`, {
                method: 'PATCH',
                body
            }),

        remove: (id: string) =>
            $api(`/customers/${id}`, {
                method: 'DELETE'
            }),

        updateStatus: (id: string, isActive: boolean) =>
            $api(`/customers/${id}/status`, {
                method: 'PATCH',
                body: { isActive }
            }),
    }
}