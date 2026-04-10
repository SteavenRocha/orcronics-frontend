import type { User } from '~/types/user'
import type { QueryResponse } from '~/types/pagination'

export function useEvihubUsersService() {
    const { $api } = useNuxtApp()

    return {
        getAllByAccount: (accountId: string, page = 1, limit = 10, search = '') =>
            $api<QueryResponse<User>>(`/evihub/users/account/${accountId}?page=${page}&limit=${limit}&search=${search}`),

        create: (body: object) =>
            $api<User>('/evihub/users', { method: 'POST', body }),

        updateStatus: (id: string, isActive: boolean) =>
            $api(`/evihub/users/${id}/status`, {
                method: 'PATCH',
                body: { isActive },
            }),
    }
}