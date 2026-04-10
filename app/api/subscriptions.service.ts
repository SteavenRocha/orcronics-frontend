import type { QueryResponse } from "~/types/pagination"
import type { Subscription } from "~/types/subscription"

export function useSubscriptionsService() {
    const { $api } = useNuxtApp()

    return {
        getAll: (page = 1, limit = 10, search = '') =>
            $api<QueryResponse<Subscription>>(`/subscriptions?page=${page}&limit=${limit}&search=${search}`),

        getOne: (id: string) =>
            $api<Subscription>(`/subscriptions/${id}`),

        subscribeToEvihub: (body: object) =>
            $api<Subscription>(`/subscriptions/evihub`, {
                method: 'POST',
                body
            }),

        updateStatus: (id: string, isActive: boolean) =>
            $api(`/subscriptions/${id}/status`, {
                method: 'PATCH',
                body: { isActive },
            }),
    }
}