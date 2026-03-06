import { branchesService } from '~/services/branches.service'
import { customersService } from '~/services/customers.service'
import type { Branch } from '~/types/branch'
import type { Customer } from '~/types/customer'
import type { Meta, QueryResponse } from '~/types/pagination'

export function useBranches(customerId: string) {
    // --- CLIENTE ---
    const customer = ref<Customer | null>(null)
    const customerLoading = ref(false)

    async function fetchCustomer() {
        customerLoading.value = true
        try {
            customer.value = await customersService.getOne(customerId)
        } catch (e) {
            console.error('Error fetching customer:', e)
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

    const filteredBranches = computed(() =>
        branches.value.filter(b =>
            b.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    )

    async function fetchBranches(page = 1) {
        loading.value = true
        try {
            const response = await branchesService.getAllByCustomer(customerId, page) as QueryResponse<Branch>
            branches.value = response.data
            meta.value = response.meta
            currentPage.value = page
        } catch (e) {
            console.error('Error fetching branches:', e)
        } finally {
            loading.value = false
        }
    }

    async function goToPage(page: number) {
        if (page < 1 || page > meta.value.totalPages) return
        await fetchBranches(page)
    }

    let searchTimeout: ReturnType<typeof setTimeout>
    watch(searchQuery, (val) => {
        clearTimeout(searchTimeout)
        if (val.length > 0 && val.length < 3) return
        searchTimeout = setTimeout(() => fetchBranches(1), 300)
    })

    return {
        customer,
        customerLoading,
        branches,
        filteredBranches,
        loading,
        searchQuery,
        meta,
        currentPage,
        fetchCustomer,
        fetchBranches,
        goToPage,
    }
}