<script setup lang="ts">
useHead({ title: 'Clientes | Orcronics' })

const {
    filteredCustomers,
    loading,
    searchQuery,
    meta,
    currentPage,
    fetchCustomers,
    goToPage,
    createCustomer,
    updateCustomer,
    removeCustomer,
    toggleStatus,
} = useCustomers()

// --- MODAL CREAR ---
const showCreateModal = ref(false)

async function handleCreate(name: string) {
    await createCustomer({ name })
    showCreateModal.value = false
}

// --- MODAL EDITAR ---
const showEditModal = ref(false)
const editingCustomer = ref<{ id: string; name: string } | null>(null)

function openEdit(customer: { id: string; name: string }) {
    editingCustomer.value = customer
    showEditModal.value = true
}

async function handleEdit(name: string) {
    if (!editingCustomer.value) return
    await updateCustomer(editingCustomer.value.id, { name })
    showEditModal.value = false
    editingCustomer.value = null
}

// --- MODAL ELIMINAR ---
const showDeleteModal = ref(false)
const deletingCustomer = ref<{ id: string; name: string } | null>(null)

function openDelete(customer: { id: string; name: string }) {
    deletingCustomer.value = customer
    showDeleteModal.value = true
}

async function handleDelete() {
    if (!deletingCustomer.value) return
    await removeCustomer(deletingCustomer.value.id)
    showDeleteModal.value = false
    deletingCustomer.value = null
}

// --- MODAL INACTIVO ---
const showInactiveModal = ref(false)

function handleRowClick(id: string, is_active: boolean) {
    if (!is_active) {
        showInactiveModal.value = true
        return
    }
    navigateTo(`/customers/${id}`)
}

onMounted(fetchCustomers)
</script>

<template>
    <div class="space-y-10">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold text-gray-900">Clientes</h1>
                <p class="text-sm text-gray-500 mt-1">Gestiona los clientes empresariales y sus datos</p>
            </div>
            <UiBaseButton label="Agregar Cliente" variant="primary" @click="showCreateModal = true">
                <template #icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-plus" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                    </svg>
                </template>
            </UiBaseButton>
        </div>

        <!-- TABLA -->
        <UiDataTable v-model:search="searchQuery" :loading="loading" :empty="filteredCustomers.length === 0"
            :meta="meta" :current-page="currentPage" search-placeholder="Buscar clientes..." @page-change="goToPage"
            :columns="['Cliente', 'Estado', 'Fecha de creación', 'Acciones']">

            <template #rows>
                <tr v-for="customer in filteredCustomers" :key="customer.id"
                    class="hover:bg-gray-50 transition-colors cursor-pointer"
                    @click="handleRowClick(customer.id, customer.is_active)">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div :style="{ backgroundColor: getAvatarColor(customer.name) }"
                                class="w-9 h-9 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {{ getInitials(customer.name) }}
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ customer.name }}</p>
                                <p class="text-xs text-gray-400">ID: {{ customer.id }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span
                            :class="['px-2.5 py-1 rounded-full text-xs font-medium', customer.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
                            {{ customer.is_active ? 'Activo' : 'Inactivo' }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ formatDate(customer.created_at) }}</td>
                    <td class="px-6 py-4" @click.stop>
                        <div class="flex items-center gap-2">
                            <UiIconButton :title="customer.is_active ? 'Desactivar' : 'Activar'" variant="warning"
                                @click="toggleStatus(customer.id, customer.is_active)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="20" height="5" x="2" y="3" rx="1"></rect>
                                    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                                    <path d="M10 12h4"></path>
                                </svg>
                            </UiIconButton>
                            <UiIconButton title="Editar" variant="primary" @click="openEdit(customer)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                </svg>
                            </UiIconButton>
                            <UiIconButton title="Eliminar" variant="danger" @click="openDelete(customer)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M10 11v6"></path>
                                    <path d="M14 11v6"></path>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                    <path d="M3 6h18"></path>
                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </UiIconButton>
                        </div>
                    </td>
                </tr>
            </template>
        </UiDataTable>
    </div>

    <!-- Modales -->
    <CustomersCustomerFormModal :show="showCreateModal" mode="create" @close="showCreateModal = false"
        @submit="handleCreate" />

    <CustomersCustomerFormModal :show="showEditModal" mode="edit" :initial-name="editingCustomer?.name"
        @close="showEditModal = false" @submit="handleEdit" />

    <UiConfirmModal :show="showDeleteModal" title="Eliminar Cliente" @close="showDeleteModal = false"
        @confirm="handleDelete">
        <template #message>
            <p>¿Estás seguro de eliminar a <strong>{{ deletingCustomer?.name }}</strong>?</p>
            <p class="mt-2 text-gray-500">Perderás todas sus Sucursales, Áreas y Dispositivos asociados. Esta acción es
                irreversible.</p>
        </template>
    </UiConfirmModal>

    <UiConfirmModal :show="showInactiveModal" title="Cliente inactivo" confirm-label="Entendido"
        confirm-variant="secondary" :hide-cancel="true" @close="showInactiveModal = false"
        @confirm="showInactiveModal = false">
        <template #message>
            <p>Este cliente esta <strong>desactivado</strong>. Debes activarlo para acceder a sus detalles,
                sucursales, áreas y dispositivos.</p>
        </template>
    </UiConfirmModal>
</template>