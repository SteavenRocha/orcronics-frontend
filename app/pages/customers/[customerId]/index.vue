<script setup lang="ts">
const route = useRoute()
const customerId = route.params.customerId as string

useHead({ title: 'Sucursales | Orcronics' })

const {
    customer,
    customerLoading,
    filteredBranches,
    loading,
    searchQuery,
    meta,
    currentPage,
    fetchCustomer,
    fetchBranches,
    goToPage,
} = useBranches(customerId)

onMounted(() => {
    fetchCustomer()
    fetchBranches()
})
</script>

<template>
    <div class="space-y-6">

        <!-- HEADER CLIENTE -->
        <div class="mb-15 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="h-20 bg-linear-to-r from-white to-primary" />
            <div class="p-5 flex items-end gap-4">
                <div :style="customer ? { backgroundColor: getAvatarColor(customer.name) } : {}"
                    class="w-16 h-16 rounded-xl flex items-center justify-center text-white text-3xl shrink-0 border-2 border-white shadow-md">
                    {{ customer ? getInitials(customer.name) : '' }}
                </div>
                <div class="pb-1">
                    <div v-if="customerLoading" class="animate-pulse space-y-2">
                        <div class="h-6 bg-gray-200 rounded w-40" />
                        <div class="h-4 bg-gray-100 rounded w-64" />
                    </div>
                    <template v-else>
                        <h1 class="text-2xl font-semibold text-gray-900">{{ customer?.name }}</h1>
                        <div class="flex items-center gap-3 mt-1">
                            <span class="text-xs text-gray-400">ID: {{ customer?.id }}</span>
                            <span
                                :class="['px-2 py-0.5 rounded-full text-xs font-medium', customer?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
                                {{ customer?.is_active ? 'Activo' : 'Inactivo' }}
                            </span>
                            <span class="text-xs text-gray-400">
                                Joined {{ customer ? formatDate(customer.created_at) : '' }}
                            </span>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <!-- SUCURSALES HEADER -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold text-gray-900">Sucursales</h1>
                <p class="text-sm text-gray-500 mt-0.5">Gestiona las sucursales de este cliente</p>
            </div>
            <UiBaseButton label="Agregar Sucursal" variant="primary">
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
        <UiDataTable v-model:search="searchQuery" :loading="loading" :empty="filteredBranches.length === 0"
            :columns="['Sucursal', 'Dirección', 'Contacto', 'Fecha de creación', 'Acciones']" :meta="meta"
            :current-page="currentPage" search-placeholder="Buscar sucursales..." @page-change="goToPage">
            <template #rows>
                <tr v-for="branch in filteredBranches" :key="branch.id"
                    class="hover:bg-gray-50 transition-colors cursor-pointer"
                    @click="navigateTo(`/customers/${customerId}/branches/${branch.id}`)">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" aria-hidden="true">
                                    <path d="M10 12h4"></path>
                                    <path d="M10 8h4"></path>
                                    <path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                                    <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2">
                                    </path>
                                    <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ branch.name }}</p>
                                <p class="text-xs text-gray-400">ID: {{ branch.id }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ branch.address ?? '—' }}</td>
                    <td class="px-6 py-4">
                        <template v-if="branch.contact_name || branch.contact_phone">
                            <p class="text-gray-900">{{ branch.contact_name ?? '—' }}</p>
                            <p class="text-xs text-gray-400">{{ branch.contact_phone ?? '—' }}</p>
                        </template>
                        <span v-else class="text-gray-400">—</span>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ formatDate(branch.created_at) }}</td>
                    <td class="px-6 py-4" @click.stop>
                        <div class="flex items-center justify-end gap-2">
                            <UiIconButton title="Editar" variant="primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                </svg>
                            </UiIconButton>
                            <UiIconButton title="Eliminar" variant="danger">
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
</template>