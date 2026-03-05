<script setup lang="ts">
useHead({ title: 'Clientes | Orcronics' })

const {
    filteredCustomers,
    loading,
    searchQuery,
    fetchCustomers,
    toggleStatus,
    removeCustomer,
    updateCustomer,
    createCustomer,
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

onMounted(fetchCustomers)
</script>

<template>
    <div class="space-y-10">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold text-gray-900">Clientes</h1>
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
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">

            <!-- BUSCADOR -->
            <div class="p-4 border-b border-gray-200">
                <div class="relative w-72">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input v-model="searchQuery" type="text" placeholder="Buscar clientes..."
                        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
            </div>

            <!-- TABLA -->
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Cliente
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Estado</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Fecha de
                            creación</th>
                        <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">

                    <!-- LOADING -->
                    <UiTableSkeleton v-if="loading" :rows="5" :cols="4" />

                    <!-- EMPTY -->
                    <tr v-else-if="filteredCustomers.length === 0">
                        <td colspan="4" class="px-6 py-16 text-center text-sm text-gray-400">
                            No se encontraron clientes
                        </td>
                    </tr>

                    <!-- FILAS -->
                    <tr v-else v-for="customer in filteredCustomers" :key="customer.id"
                        class="hover:bg-gray-50 transition-colors cursor-pointer"
                        @click="navigateTo(`/customers/${customer.id}`)">
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
                            <div class="flex items-center justify-end gap-2">
                                <UiIconButton :title="customer.is_active ? 'Desactivar' : 'Activar'" variant="warning"
                                    @click="toggleStatus(customer.id, customer.is_active)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-archive" aria-hidden="true">
                                        <rect width="20" height="5" x="2" y="3" rx="1"></rect>
                                        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                                        <path d="M10 12h4"></path>
                                    </svg>
                                </UiIconButton>

                                <UiIconButton title="Editar" variant="primary" @click="openEdit(customer)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-pen" aria-hidden="true">
                                        <path
                                            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z">
                                        </path>
                                    </svg>
                                </UiIconButton>

                                <UiIconButton title="Eliminar" variant="danger" @click="openDelete(customer)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2"
                                        aria-hidden="true">
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

                </tbody>
            </table>
        </div>
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
            <p class="mt-2 text-gray-500">Perderás todas sus Sucursales, Áreas y Dispositivos. Esta acción es
                irreversible.</p>
        </template>
    </UiConfirmModal>
</template>