import type { Subscription } from '~/types/subscription'
import type { Meta } from '~/types/pagination'
import { useSubscriptionsService } from '~/api/subscriptions.service'

export function useSubscriptions() {
    const subscriptionsService = useSubscriptionsService()
    const subscriptions = ref<Subscription[]>([])
    const subscription = ref<Subscription | null>(null)
    const subscriptionLoading = ref(false)
    const loading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const meta = ref<Meta>({
        total: 0, page: 1, limit: 10,
        totalPages: 1, hasNextPage: false, hasPrevPage: false
    })

    async function fetchSubscriptions(page = 1) {
        loading.value = true
        try {
            const response = await subscriptionsService.getAll(page, 10, searchQuery.value)
            subscriptions.value = response.data
            meta.value = response.meta
            currentPage.value = page
        } catch (e) {
            console.error('Error fetching subscriptions:', e)
        } finally {
            loading.value = false
        }
    }

    async function fetchOne(id: string) {
        subscriptionLoading.value = true
        try {
            subscription.value = await subscriptionsService.getOne(id)
        } catch (e) {
            console.error('Error fetching subscription:', e)
        } finally {
            subscriptionLoading.value = false
        }
    }

    async function goToPage(page: number) {
        if (page < 1 || page > meta.value.totalPages) return
        await fetchSubscriptions(page)
    }

    async function subscribeToEvihub(body: object) {
        try {
            await subscriptionsService.subscribeToEvihub(body)
            await fetchSubscriptions(1)
        } catch (e) {
            console.error('Error subscribing to Evihub:', e)
        }
    }

    async function updateStatus(id: string, isActive: boolean) {
        try {
            await subscriptionsService.updateStatus(id, isActive)
            const sub = subscriptions.value.find(s => s.id === id)
            if (sub) sub.isActive = isActive
        } catch (e) {
            console.error('Error updating status:', e)
        }
    }

    watch(searchQuery, () => {
        fetchSubscriptions(1)
    })

    return {
        subscriptions,
        subscription,
        loading,
        subscriptionLoading,
        searchQuery,
        meta,
        currentPage,
        fetchSubscriptions,
        fetchOne,
        updateStatus,
        goToPage,
        subscribeToEvihub,
    }
}