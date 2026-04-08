import type { Customer } from '~/types/customer'
import type { Meta } from '~/types/pagination'
import { useCustomersService } from '~/api/customers.service'

export function useCustomers() {
    const customersService = useCustomersService()
    const customers = ref<Customer[]>([])
    const loading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const meta = ref<Meta>({
        total: 0, page: 1, limit: 10,
        totalPages: 1, hasNextPage: false, hasPrevPage: false
    })

    /* Busca en la tabla de clientes, sin ncesidad de llamar a la API */
    /* const filteredCustomers = computed(() =>
        customers.value.filter(c =>
            c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    ) */

    async function fetchCustomers(page = 1) {
        loading.value = true
        try {
            const response = await customersService.getAll(page, 10, searchQuery.value)
            customers.value = response.data
            meta.value = response.meta
            currentPage.value = page
        } catch (e) {
            console.error('Error fetching customers:', e)
        } finally {
            loading.value = false
        }
    }

    async function goToPage(page: number) {
        if (page < 1 || page > meta.value.totalPages) return
        await fetchCustomers(page)
    }

    async function createCustomer(body: object) {
        try {
            await customersService.create(body)
            /* customers.value.unshift(newCustomer) */ // agrega al inicio de la lista
            await fetchCustomers(1)
        } catch (e) {
            console.error('Error creating customer:', e)
        }
    }

    async function updateStatus(id: string, isActive: boolean) {
        try {
            await customersService.updateStatus(id, isActive)
            const customer = customers.value.find(c => c.id === id)
            if (customer) customer.isActive = isActive

        } catch (e) {
            console.error('Error toggling status:', e)
        }
    }

    async function updateCustomer(id: string, body: object) {
        try {
            const updated = await customersService.update(id, body)
            const index = customers.value.findIndex(c => c.id === id)
            if (index !== -1) customers.value[index] = updated
        } catch (e) {
            console.error('Error updating customer:', e)
        }
    }

    async function removeCustomer(id: string) {
        try {
            await customersService.remove(id)
            if (customers.value.length === 1 && currentPage.value > 1) {
                await fetchCustomers(currentPage.value - 1)
            } else {
                await fetchCustomers(currentPage.value)
            }
        } catch (e) {
            console.error('Error deleting customer:', e)
        }
    }

    watch(searchQuery, () => {
        fetchCustomers(1)
    })

    return {
        customers,
        loading,
        searchQuery,
        meta,
        currentPage,
        fetchCustomers,
        goToPage,
        createCustomer,
        updateCustomer,
        removeCustomer,
        updateStatus,
    }
}