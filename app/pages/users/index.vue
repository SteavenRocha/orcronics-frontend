<script setup lang="ts">
useHead({ title: 'Usuarios | Orcronics' })

const {
    users,
    loading,
    searchQuery,
    meta,
    currentPage,
    fetchUsers,
    goToPage,
    createUser,
    updateUser,
    removeUser,
    toggleStatus,
} = useUsers()

const { items: breadcrumbs } = useBreadcrumb()

// --- MODAL CREAR ---
const showCreateModal = ref(false)

async function handleCreate(data: object) {
    await createUser(data)
    showCreateModal.value = false
}

// --- MODAL EDITAR ---
const showEditModal = ref(false)
const editingUser = ref<{ id: string; first_name: string; last_name: string; email: string; role: string } | null>(null)

function openEdit(user: typeof editingUser.value) {
    editingUser.value = user
    showEditModal.value = true
}

async function handleEdit(data: object) {
    if (!editingUser.value) return
    await updateUser(editingUser.value.id, data)
    showEditModal.value = false
    editingUser.value = null
}

// --- MODAL ELIMINAR ---
const showDeleteModal = ref(false)
const deletingUser = ref<{ id: string; first_name: string; last_name: string } | null>(null)

function openDelete(user: typeof deletingUser.value) {
    deletingUser.value = user
    showDeleteModal.value = true
}

async function handleDelete() {
    if (!deletingUser.value) return
    await removeUser(deletingUser.value.id)
    showDeleteModal.value = false
    deletingUser.value = null
}

onMounted(fetchUsers)
</script>

<template>
    <div class="space-y-8">
        <UiBreadcrumb :items="breadcrumbs" />

        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold text-gray-900">Usuarios</h1>
                <p class="text-sm text-gray-500 mt-1">Gestiona los usuarios y sus permisos de acceso</p>
            </div>
            <UiBaseButton label="Agregar Usuario" variant="primary" @click="showCreateModal = true">
                <template #icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                </template>
            </UiBaseButton>
        </div>

        <UiDataTable v-model:search="searchQuery" :loading="loading" :empty="users.length === 0" :meta="meta"
            :current-page="currentPage" search-placeholder="Buscar usuarios..." @page-change="goToPage"
            :columns="['Usuario', 'Email', 'Rol', 'Estado', 'Fecha de creación', 'Acciones']">
            <template #rows>
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div :style="{ backgroundColor: getAvatarColor(`${user.first_name} ${user.last_name}`) }"
                                class="w-9 h-9 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {{ getInitials(`${user.first_name} ${user.last_name}`) }}
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</p>
                                <p class="text-xs text-gray-400">ID: {{ user.id }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ user.email }}</td>
                    <td class="px-6 py-4">
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                            {{ user.role.replace(/_/g, ' ') }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <span :class="['px-2.5 py-1 rounded-full text-xs font-medium',
                            user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
                            {{ user.is_active ? 'Activo' : 'Inactivo' }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ formatDate(user.created_at) }}</td>
                    <td class="px-6 py-4" @click.stop>
                        <div class="flex items-center gap-2">
                            <UiIconButton :title="user.is_active ? 'Desactivar' : 'Activar'" variant="warning"
                                @click="toggleStatus(user.id, user.is_active)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="20" height="5" x="2" y="3" rx="1" />
                                    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                                    <path d="M10 12h4" />
                                </svg>
                            </UiIconButton>
                            <UiIconButton title="Editar" variant="primary" @click="openEdit(user)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                </svg>
                            </UiIconButton>
                            <UiIconButton title="Eliminar" variant="danger" @click="openDelete(user)">
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

    <UsersUserFormModal :show="showCreateModal" mode="create" @close="showCreateModal = false" @submit="handleCreate" />

    <UsersUserFormModal :show="showEditModal" mode="edit" :initial-data="editingUser ?? undefined"
        @close="showEditModal = false" @submit="handleEdit" />

    <UiConfirmModal :show="showDeleteModal" title="Eliminar Usuario" @close="showDeleteModal = false"
        @confirm="handleDelete">
        <template #message>
            <p>¿Estás seguro de eliminar al usuario: <strong>{{ deletingUser?.first_name }} {{ deletingUser?.last_name
                    }}</strong>?</p>
            <p class="mt-2 text-gray-500">Esta acción es irreversible.</p>
        </template>
    </UiConfirmModal>
</template>