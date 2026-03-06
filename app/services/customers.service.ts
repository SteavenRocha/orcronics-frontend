import type { QueryResponse } from '~/types/pagination'
import type { Customer } from '~/types/customer'

export const customersService = {
    getAll: (page = 1, limit = 10, search = '') =>
        $fetch<QueryResponse<Customer>>(`${useApi()}/customers?page=${page}&limit=${limit}&search=${search}`),

    create: (body: object) =>
        $fetch<Customer>(`${useApi()}/customers`, { method: 'POST', body }),

    update: (id: string, body: object) =>
        $fetch<Customer>(`${useApi()}/customers/${id}`, { method: 'PATCH', body }),

    remove: (id: string) =>
        $fetch(`${useApi()}/customers/${id}`, { method: 'DELETE' }),

    activate: (id: string) =>
        $fetch<Customer>(`${useApi()}/customers/activate/${id}`, { method: 'PATCH' }),

    deactivate: (id: string) =>
        $fetch<Customer>(`${useApi()}/customers/deactivate/${id}`, { method: 'PATCH' }),
}