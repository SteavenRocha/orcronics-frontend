<script setup lang="ts">
useHead({ title: 'Evihub usuarios | Orcronics' })

const route = useRoute()
const subscriptionId = route.params.id as string

const {
    subscription,
    subscriptionLoading,
    fetchOne
} = useSubscriptions()

// --- BREADCRUMBS ---
const { items: breadcrumbs } = useBreadcrumb(computed(() => ({
    subscription: subscription.value?.customer?.name ?? null
})))

const {
    users,
    loading,
    searchQuery,
    meta,
    currentPage,
    fetchUsers,
    createUser,
    updateStatus,
    goToPage,
} = useEvihubUsers(computed(() => subscription.value?.externalAccountId ?? ''))

// --- MODAL CREAR ---
const showCreateModal = ref(false)

async function handleCreate(body: object) {
    await createUser(body)
    showCreateModal.value = false
}

onMounted(async () => {
    await fetchOne(subscriptionId)
    if (subscription.value?.externalAccountId) {
        await fetchUsers()
    }
})
</script>

<template>
    <div class="space-y-8">
        <UiBreadcrumb :items="breadcrumbs" />

        <!-- HEADER CLIENTE -->
        <SubscriptionsSubscriptionHeader :subscription="subscription" :loading="subscriptionLoading" />

        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold text-gray-900">
                    Usuarios
                </h1>
                <p class="text-sm text-gray-500 mt-1">Gestiona los usuarios y sus permisos de acceso</p>
            </div>
            <UiBaseButton label="Nuevo usuario" variant="primary" @click="showCreateModal = true">
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

        <UiDataTable v-model:search="searchQuery" :loading="loading" :empty="users.length === 0" :meta="meta"
            :current-page="currentPage" search-placeholder="Buscar usuarios..." @page-change="goToPage"
            :columns="['Usuario', 'Email', 'Rol', 'Estado', 'Fecha de creación', 'Acciones']">
            <template #rows>
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div :style="{ backgroundColor: getAvatarColor(user.firstName + ' ' + user.lastName) }"
                                class="w-9 h-9 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {{ getInitials(user.firstName + ' ' + user.lastName) }}
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ user.firstName + ' ' + user.lastName }}</p>
                                <p class="text-xs text-gray-400">ID: {{ user.id }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ user.email }}</td>
                    <td class="px-6 py-4">
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                            {{ user.role.toLowerCase() }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <span :class="['px-2.5 py-1 rounded-full text-xs font-medium',
                            user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
                            {{ user.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ formatDate(user.createdAt) }}</td>
                    <td class="px-6 py-4" @click.stop>
                        <div class="flex items-center gap-2">
                            <UiIconButton :title="user.isActive ? 'Desactivar' : 'Activar'" variant="warning"
                                @click="updateStatus(user.id, !user.isActive)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="20" height="5" x="2" y="3" rx="1" />
                                    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                                    <path d="M10 12h4" />
                                </svg>
                            </UiIconButton>
                        </div>
                    </td>
                </tr>
            </template>
        </UiDataTable>
    </div>

    <!-- Modales -->
    <EvihubUserFormModal :show="showCreateModal" @close="showCreateModal = false" @submit="handleCreate"
        :account-id="subscription?.externalAccountId ?? ''" />
</template>