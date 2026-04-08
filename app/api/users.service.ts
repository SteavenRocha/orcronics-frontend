import type { User } from '~/types/user'
import type { QueryResponse } from '~/types/pagination'

export function useUsersService() {
    const { $api } = useNuxtApp()

    return {
        getAll: (page = 1, limit = 10, search = '') =>
            $api<QueryResponse<User>>(`/users?page=${page}&limit=${limit}&search=${search}`),

        getOne: (id: string) =>
            $api<User>(`/users/${id}`),

        create: (body: object) =>
            $api<User>('/users', {
                method: 'POST',
                body
            }),

        update: (id: string, body: object) =>
            $api<User>(`/users/${id}`, {
                method: 'PATCH',
                body
            }),

        updateStatus: (id: string, isActive: boolean) =>
            $api(`/users/${id}/status`, {
                method: 'PATCH',
                body: { isActive }
            }),

        remove: (id: string) =>
            $api(`/users/${id}`, {
                method: 'DELETE'
            }),
    }
}