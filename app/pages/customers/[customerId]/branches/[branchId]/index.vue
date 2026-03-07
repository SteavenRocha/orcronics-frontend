<script setup lang="ts">
import type { Area } from '~/types/area'

const route = useRoute()
const customerId = route.params.customerId as string
const branchId = route.params.branchId as string

useHead({ title: 'Areas | Orcronics' })

const {
    customer,
    customerLoading,
    filteredAreas,
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
} = useAreas(customerId, branchId)

// --- MODAL CREAR ---
const showCreateModal = ref(false)

async function handleCreate(data: { name: string; description: string }) {
    await createArea({
        name: data.name,
        description: data.description || null,
        branch_id: branchId
    })
    showCreateModal.value = false
}

// --- MODAL EDITAR ---
const showEditModal = ref(false)
const editingArea = ref<Area | null>(null)

function openEdit(area: Area) {
    editingArea.value = area
    showEditModal.value = true
}

async function handleEdit(data: { name: string; description: string }) {
    if (!editingArea.value) return
    await updateArea(editingArea.value.id, {
        name: data.name,
        description: data.description || null,
    })
    showEditModal.value = false
    editingArea.value = null
}

// --- MODAL ELIMINAR ---
const showDeleteModal = ref(false)
const deletingArea = ref<Area | null>(null)

function openDelete(area: Area) {
    deletingArea.value = area
    showDeleteModal.value = true
}

async function handleDelete() {
    if (!deletingArea.value) return
    await removeArea(deletingArea.value.id)
    showDeleteModal.value = false
    deletingArea.value = null
}

onMounted(() => {
    fetchCustomer()
    fetchAreas()
})
</script>

<template>
    <div class="space-y-6">

        <!-- HEADER CLIENTE -->
        <CustomersCustomerHeader :customer="customer" :loading="customerLoading" />

        <!-- SUCURSALES HEADER -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold text-gray-900">Areas</h1>
                <p class="text-sm text-gray-500 mt-0.5">Gestiona las areas de este cliente</p>
            </div>
            <UiBaseButton label="Agregar Area" variant="primary" @click="showCreateModal = true">
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
        <UiDataTable v-model:search="searchQuery" :loading="loading" :empty="filteredAreas.length === 0"
            :columns="['Area', 'Descripción', 'Dispositivos Asociados', 'Fecha de creación', 'Acciones']" :meta="meta"
            :current-page="currentPage" search-placeholder="Buscar areas..." @page-change="goToPage">
            <template #rows>
                <tr v-for="area in filteredAreas" :key="area.id"
                    class="hover:bg-gray-50 transition-colors cursor-pointer"
                    @click="navigateTo(`/customers/${customerId}/branches/${area.id}`)">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-grip" aria-hidden="true">
                                    <circle cx="12" cy="5" r="1"></circle>
                                    <circle cx="19" cy="5" r="1"></circle>
                                    <circle cx="5" cy="5" r="1"></circle>
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="19" cy="12" r="1"></circle>
                                    <circle cx="5" cy="12" r="1"></circle>
                                    <circle cx="12" cy="19" r="1"></circle>
                                    <circle cx="19" cy="19" r="1"></circle>
                                    <circle cx="5" cy="19" r="1"></circle>
                                </svg>
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ area.name }}</p>
                                <p class="text-xs text-gray-400">ID: {{ area.id }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-500">
                        <p>{{ area.description ?? 'No hay descripción' }}</p>
                    </td>
                    <td class="px-6 py-4 text-xs font-medium text-gray-900">
                        <p class="rounded-base bg-gray-100 py-0.5 px-2 w-fit">
                            {{ area.device_count ?? 0 }} Dispositivos
                        </p>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ formatDate(area.created_at) }}</td>
                    <td class="px-6 py-4" @click.stop>
                        <div class="flex items-center justify-start gap-2">
                            <UiIconButton title="Editar" variant="primary" @click="openEdit(area)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                </svg>
                            </UiIconButton>
                            <UiIconButton title="Eliminar" variant="danger" @click="openDelete(area)">
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
    <AreasAreaFormModal :show="showCreateModal" mode="create" @close="showCreateModal = false" @submit="handleCreate" />

    <AreasAreaFormModal :show="showEditModal" mode="edit" :initial-data="editingArea ?? undefined"
        @close="showEditModal = false" @submit="handleEdit" />

    <UiConfirmModal :show="showDeleteModal" title="Eliminar Area" @close="showDeleteModal = false"
        @confirm="handleDelete">
        <template #message>
            <p>¿Estás seguro de eliminar a <strong>{{ deletingArea?.name }}</strong>?</p>
            <p class="mt-2 text-gray-500">Perderás todas sus Dispositivos asociados. Esta acción es irreversible.</p>
        </template>
    </UiConfirmModal>
</template>