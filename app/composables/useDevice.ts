import { devicesService } from '~/services/devices.service'
import { customersService } from '~/services/customers.service'
import type { Device } from '~/types/device'
import type { Customer } from '~/types/customer'
import type { Meta } from '~/types/pagination'
import type { Branch } from '~/types/branch'
import type { Area } from '~/types/area'
import { branchesService } from '~/services/branches.service'
import { areasService } from '~/services/areas.service'

export function useDevices(customerId: string, branchId: string, areaId: string) {
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

    // --- SUCURSAL ---
    const branch = ref<Branch | null>(null)

    async function fetchBranch() {
        try {
            branch.value = await branchesService.getOne(branchId)
        } catch (e: any) {
            if (e?.response?.status === 404) await navigateTo('/customers')
            else console.error(e)
        }
    }

    // --- AREA ---
    const area = ref<Area | null>(null)

    async function fetchArea() {
        try {
            area.value = await areasService.getOne(areaId)
        } catch (e: any) {
            if (e?.response?.status === 404) await navigateTo('/customers')
            else console.error(e)
        }
    }

    // --- DISPOSITIVOS ---
    const devices = ref<Device[]>([])
    const loading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const meta = ref<Meta>({
        total: 0, page: 1, limit: 10,
        totalPages: 1, hasNextPage: false, hasPrevPage: false
    })

    async function fetchDevices(page = 1) {
        loading.value = true
        try {
            const response = await devicesService.getAllByArea(areaId, page, 10, searchQuery.value)
            devices.value = response.data
            meta.value = response.meta
            currentPage.value = page
        } catch (e) {
            console.error('Error fetching devices:', e)
        } finally {
            loading.value = false
        }
    }

    async function createDevice(body: object) {
        try {
            await devicesService.create(body)
            await fetchDevices(1)
        } catch (e) {
            console.error('Error creating area:', e)
        }
    }

    async function updateDevice(id: string, body: object) {
        try {
            const updated = await devicesService.update(id, body)
            const index = devices.value.findIndex(b => b.id === id)
            if (index !== -1) devices.value[index] = updated
        } catch (e) {
            console.error('Error updating branch:', e)
        }
    }

    async function removeDevice(id: string) {
        try {
            await devicesService.remove(id)
            if (devices.value.length === 1 && currentPage.value > 1) {
                await fetchDevices(currentPage.value - 1)
            } else {
                await fetchDevices(currentPage.value)
            }
        } catch (e) {
            console.error('Error deleting area:', e)
        }
    }

    async function goToPage(page: number) {
        if (page < 1 || page > meta.value.totalPages) return
        await fetchDevices(page)
    }

    watch(searchQuery, () => {
        fetchDevices(1)
    })

    return {
        customer,
        branch,
        area,
        devices,
        customerLoading,
        loading,
        searchQuery,
        meta,
        currentPage,
        fetchCustomer,
        fetchBranch,
        fetchArea,
        fetchDevices,
        createDevice,
        updateDevice,
        removeDevice,
        goToPage,
    }
}