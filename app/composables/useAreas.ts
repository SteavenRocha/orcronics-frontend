import { areasService } from '~/services/areas.service'
import { customersService } from '~/services/customers.service'
import type { Area } from '~/types/area'
import type { Customer } from '~/types/customer'
import type { Meta } from '~/types/pagination'

export function useAreas(customerId: string, branchId: string) {
    // --- CLIENTE ---
    const customer = ref<Customer | null>(null)
    const customerLoading = ref(false)

    async function fetchCustomer() {
        customerLoading.value = true
        try {
            customer.value = await customersService.getOne(customerId)
        } catch (e: any) {
            if (e?.response?.status === 404) {
                await navigateTo('/customers')
            } else {
                console.error(e)
            }
        } finally {
            customerLoading.value = false
        }
    }

    // --- AREAS ---
    const areas = ref<Area[]>([])
    const loading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const meta = ref<Meta>({
        total: 0, page: 1, limit: 10,
        totalPages: 1, hasNextPage: false, hasPrevPage: false
    })

    async function fetchAreas(page = 1) {
        loading.value = true
        try {
            const response = await areasService.getAllByBranch(branchId, page, 10, searchQuery.value)
            areas.value = response.data
            meta.value = response.meta
            currentPage.value = page
        } catch (e) {
            console.error('Error fetching areas:', e)
        } finally {
            loading.value = false
        }
    }

    async function createArea(body: object) {
        try {
            await areasService.create(body)
            await fetchAreas(1)
        } catch (e) {
            console.error('Error creating area:', e)
        }
    }

    async function updateArea(id: string, body: object) {
        try {
            const updated = await areasService.update(id, body)
            const index = areas.value.findIndex(b => b.id === id)
            if (index !== -1) {
                const current = areas.value[index]
                areas.value[index] = {
                    ...updated,
                    device_count: current?.device_count ?? 0
                }
            }
        } catch (e) {
            console.error('Error updating area:', e)
        }
    }

    async function removeArea(id: string) {
        try {
            await areasService.remove(id)
            if (areas.value.length === 1 && currentPage.value > 1) {
                await fetchAreas(currentPage.value - 1)
            } else {
                await fetchAreas(currentPage.value)
            }
        } catch (e) {
            console.error('Error deleting area:', e)
        }
    }

    async function goToPage(page: number) {
        if (page < 1 || page > meta.value.totalPages) return
        await fetchAreas(page)
    }

    watch(searchQuery, () => {
        fetchAreas(1)
    })

    return {
        customer,
        customerLoading,
        areas,
        loading,
        searchQuery,
        meta,
        currentPage,
        fetchCustomer,
        fetchAreas,
        createArea,
        updateArea,
        removeArea,
        goToPage,
    }
}