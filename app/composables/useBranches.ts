import { branchesService } from '~/services/branches.service'
import { customersService } from '~/services/customers.service'
import type { Branch } from '~/types/branch'
import type { Customer } from '~/types/customer'
import type { Meta } from '~/types/pagination'

export function useBranches(customerId: string) {
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

    // --- SUCURSALES ---
    const branches = ref<Branch[]>([])
    const loading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const meta = ref<Meta>({
        total: 0, page: 1, limit: 10,
        totalPages: 1, hasNextPage: false, hasPrevPage: false
    })

    async function fetchBranches(page = 1) {
        loading.value = true
        try {
            const response = await branchesService.getAllByCustomer(customerId, page, 10, searchQuery.value)
            branches.value = response.data
            meta.value = response.meta
            currentPage.value = page
        } catch (e) {
            console.error('Error fetching branches:', e)
        } finally {
            loading.value = false
        }
    }

    async function createBranch(body: object) {
        try {
            await branchesService.create(body)
            await fetchBranches(1)
        } catch (e) {
            console.error('Error creating branch:', e)
        }
    }

    async function updateBranch(id: string, body: object) {
        try {
            const updated = await branchesService.update(id, body)
            const index = branches.value.findIndex(b => b.id === id)
            if (index !== -1) branches.value[index] = updated
        } catch (e) {
            console.error('Error updating branch:', e)
        }
    }

    async function removeBranch(id: string) {
        try {
            await branchesService.remove(id)
            if (branches.value.length === 1 && currentPage.value > 1) {
                await fetchBranches(currentPage.value - 1)
            } else {
                await fetchBranches(currentPage.value)
            }
        } catch (e) {
            console.error('Error deleting branch:', e)
        }
    }

    async function goToPage(page: number) {
        if (page < 1 || page > meta.value.totalPages) return
        await fetchBranches(page)
    }

    watch(searchQuery, () => {
        fetchBranches(1)
    })

    return {
        customer,
        customerLoading,
        branches,
        loading,
        searchQuery,
        meta,
        currentPage,
        fetchCustomer,
        fetchBranches,
        createBranch,
        updateBranch,
        removeBranch,
        goToPage,
    }
}