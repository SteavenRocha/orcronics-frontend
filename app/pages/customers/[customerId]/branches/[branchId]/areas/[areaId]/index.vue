<script setup lang="ts">
import type { Device } from '~/types/device'

const route = useRoute()
const customerId = route.params.customerId as string
const branchId = route.params.branchId as string
const areaId = route.params.areaId as string

useHead({ title: 'Dispositivos | Orcronics' })

const {
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
} = useDevices(customerId, branchId, areaId)

// -- BREADCRUMBS --
const { items: breadcrumbs } = useBreadcrumb(
    computed(() => ({
        customer: customer.value?.name,
        branch: branch.value?.name,
        area: area.value?.name
    }))
)

// --- MODAL CREAR ---
const showCreateModal = ref(false)

async function handleCreate(data: {
    name: string
    type: string
    serial: string | null
    username: string | null
    password: string | null
    notes: string | null
    metadata: { field: string; value: string }[]
}) {
    await createDevice({
        ...data,
        area_id: areaId,
    })
    showCreateModal.value = false
}

// --- MODAL EDITAR ---
const showEditModal = ref(false)
const editingDevice = ref<Device | null>(null)

function openEdit(device: Device) {
    editingDevice.value = device
    showEditModal.value = true
}

async function handleEdit(data: {
    name: string
    type: string
    serial: string | null
    username: string | null
    password: string | null
    notes: string | null
    metadata: { field: string; value: string }[]
}) {
    if (!editingDevice.value) return
    await updateDevice(editingDevice.value.id, { ...data })
    showEditModal.value = false
    editingDevice.value = null
}

// --- MODAL ELIMINAR ---
const showDeleteModal = ref(false)
const deletingDevice = ref<Device | null>(null)

function openDelete(device: Device) {
    deletingDevice.value = device
    showDeleteModal.value = true
}

async function handleDelete() {
    if (!deletingDevice.value) return
    await removeDevice(deletingDevice.value.id)
    showDeleteModal.value = false
    deletingDevice.value = null
}

onMounted(() => {
    fetchCustomer()
    fetchBranch()
    fetchArea()
    fetchDevices()
})
</script>

<template>
    <div class="space-y-6">
        <!-- BREADCRUMBS -->
        <UiBreadcrumb :items="breadcrumbs" />

        <!-- HEADER CLIENTE -->
        <CustomersCustomerHeader :customer="customer" :loading="customerLoading" />

        <!-- SUCURSALES HEADER -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold text-gray-900">Dispositivos</h1>
                <p class="text-sm text-gray-500 mt-0.5">Gestiona los dispositivos de este cliente</p>
            </div>
            <UiBaseButton label="Agregar Dispositivo" variant="primary" @click="showCreateModal = true">
                <template #icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                </template>
            </UiBaseButton>
        </div>

        <!-- TABLA -->
        <UiDataTable v-model:search="searchQuery" :loading="loading" :empty="devices.length === 0"
            :columns="['Area', 'Tipo', 'Número de Serie', 'Credenciales', 'Fecha de creación', 'Acciones']" :meta="meta"
            :current-page="currentPage" search-placeholder="Buscar dispositivos..." @page-change="goToPage">
            <template #rows>
                <tr v-for="device in devices" :key="device.id" class="hover:bg-gray-50 transition-colors cursor-pointer"
                    @click="navigateTo(`/customers/${customerId}/branches/${device.id}/areas/${device.id}`)">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14">
                                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M10.5 13.5a3 3 0 0 0 0-6h-7a3 3 0 0 0 0 6Z" />
                                        <path
                                            d="M.58 9.79L2.17 2.1a2 2 0 0 1 2-1.6h5.7a2 2 0 0 1 2 1.6l1.59 7.69m-9.96.71h3" />
                                        <circle cx="10.5" cy="10.5" r=".5" />
                                    </g>
                                </svg>
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ device.name }}</p>
                                <p class="text-xs text-gray-400">ID: {{ device.id }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-500">
                        <p>{{ device.type ?? '—' }}</p>
                    </td>
                    <td class="px-6 py-4 text-gray-500">
                        <p>{{ device.serial ?? '—' }}</p>
                    </td>
                    <td class="px-6 py-4">
                        <span
                            :class="['px-2 py-0.5 rounded-full text-xs font-medium', (device.username && device.password) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
                            {{ (device.username && device.password) ? 'Sí' : 'No' }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ formatDate(device.created_at) }}</td>
                    <td class="px-6 py-4" @click.stop>
                        <div class="flex items-center justify-start gap-2">
                            <UiIconButton title="Editar" variant="primary" @click="openEdit(device)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                </svg>
                            </UiIconButton>
                            <UiIconButton title="Eliminar" variant="danger" @click="openDelete(device)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                    <path d="M3 6h18" />
                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </UiIconButton>
                        </div>
                    </td>
                </tr>
            </template>
        </UiDataTable>
    </div>

    <!-- Modales -->
    <DevicesDeviceFormModal :show="showCreateModal" mode="create" @close="showCreateModal = false"
        @submit="handleCreate" />

    <DevicesDeviceFormModal :show="showEditModal" mode="edit" :initial-data="editingDevice ?? undefined"
        @close="showEditModal = false" @submit="handleEdit" />

    <UiConfirmModal :show="showDeleteModal" title="Eliminar Dispositivo" @close="showDeleteModal = false"
        @confirm="handleDelete">
        <template #message>
            <p>¿Estás seguro de eliminar este dispositivo: <strong>{{ deletingDevice?.name }}</strong>?</p>
            <p class="mt-2 text-gray-500">Perderás toda la Metadata asociada. Esta acción es irreversible.</p>
        </template>
    </UiConfirmModal>
</template>