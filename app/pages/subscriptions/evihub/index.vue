<script setup lang="ts">
useHead({ title: 'Evihub | Orcronics' })

const {
    subscriptions,
    loading,
    searchQuery,
    meta,
    currentPage,
    fetchSubscriptions,
    updateStatus,
    goToPage,
    subscribeToEvihub
} = useSubscriptions()

// --- BREADCRUMBS ---
const { items: breadcrumbs } = useBreadcrumb()

// --- MODAL CREAR ---
const showCreateModal = ref(false)

async function handleCreate(customerId: string) {
    await subscribeToEvihub({ customerId })
    showCreateModal.value = false
}

onMounted(fetchSubscriptions)
</script>

<template>
    <div class="space-y-8">
        <!-- BREADCRUMBS -->
        <UiBreadcrumb :items="breadcrumbs" />

        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold text-gray-900">Clientes Evihub</h1>
                <p class="text-sm text-gray-500 mt-1">Gestiona las suscripciones de los clientes y sus
                    datos</p>
            </div>
            <UiBaseButton label="Nueva Suscripción" variant="primary" @click="showCreateModal = true">
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
        <UiDataTable v-model:search="searchQuery" :loading="loading" :empty="subscriptions.length === 0" :meta="meta"
            :current-page="currentPage" search-placeholder="Buscar clientes..." @page-change="goToPage"
            :columns="['Cliente', 'Servicio', 'Estado', 'Fecha de suscripción', 'Acciones']">
            <template #rows>
                <tr v-for="sub in subscriptions" :key="sub.id" class="hover:bg-gray-50 transition-colors cursor-pointer"
                    @click="navigateTo(`/subscriptions/evihub/${sub.id}`)">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div :style="{ backgroundColor: getAvatarColor(sub.customer.name) }"
                                class="w-9 h-9 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {{ getInitials(sub.customer.name) }}
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ sub.customer.name }}</p>
                                <p class="text-xs text-gray-400">ID: {{ sub.id }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                            {{ sub.serviceName }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <span :class="['px-2.5 py-1 rounded-full text-xs font-medium',
                            sub.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
                            {{ sub.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ formatDate(sub.createdAt) }}</td>
                    <td class="px-6 py-4" @click.stop>
                        <div class="flex items-center gap-2">
                            <UiIconButton :title="sub.isActive ? 'Desactivar' : 'Activar'" variant="warning"
                                @click="updateStatus(sub.id, !sub.isActive)">
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
    <SubscriptionsSubscriptionFormModal :show="showCreateModal" @close="showCreateModal = false"
        @submit="handleCreate" />
</template>