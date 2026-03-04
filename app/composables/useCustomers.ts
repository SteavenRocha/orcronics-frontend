import { customersService } from '~/services/customers.service'

interface Customer {
    id: string
    name: string
    is_active: boolean
    created_at: string
}

export function useCustomers() {
    const customers = ref<Customer[]>([])
    const loading = ref(false)
    const searchQuery = ref('')

    /* Busca en la tabla de clientes, sin ncesidad de llamar a la API */
    const filteredCustomers = computed(() =>
        customers.value.filter(c =>
            c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    )

    async function fetchCustomers() {
        loading.value = true
        try {
            const response = await customersService.getAll()
            customers.value = response.data
        } catch (e) {
            console.error('Error fetching customers:', e)
        } finally {
            loading.value = false
        }
    }

    async function toggleStatus(id: string, is_active: boolean) {
        try {
            const updated = await (is_active
                ? customersService.deactivate(id)
                : customersService.activate(id)
            ) as Customer

            const index = customers.value.findIndex(c => c.id === id)
            if (index !== -1) customers.value[index] = updated

        } catch (e) {
            console.error('Error toggling status:', e)
        }
    }

    async function removeCustomer(id: string) {
        try {
            await customersService.remove(id)
            await fetchCustomers()
        } catch (e) {
            console.error('Error deleting customer:', e)
        }
    }

    async function updateCustomer(id: string, body: object) {
        try {
            await customersService.update(id, body)
            await fetchCustomers()
        } catch (e) {
            console.error('Error updating customer:', e)
        }
    }

    return {
        customers,
        filteredCustomers,
        loading,
        searchQuery,
        fetchCustomers,
        toggleStatus,
        removeCustomer,
        updateCustomer,
    }
}