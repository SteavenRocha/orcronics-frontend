<script setup lang="ts">
const route = useRoute()
const customerId = route.params.customerId as string

useHead({ title: 'Sucursales | Orcronics' })

const {
    filteredBranches,
    loading,
    searchQuery,
    meta,
    currentPage,
    fetchBranches,
    goToPage,
} = useBranches(customerId)

onMounted(fetchBranches)
</script>

<template>
    <div class="space-y-10">

        <!-- HEADER -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold text-gray-900">Sucursales</h1>
                <p class="text-sm text-gray-500 mt-1">Gestiona las sucursales de este cliente</p>
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
        <UiDataTable v-model:search="searchQuery" :loading="loading" :empty="filteredBranches.length === 0" :meta="meta"
            :current-page="currentPage" search-placeholder="Buscar sucursales..." @page-change="goToPage"
            :columns="['Sucursal', 'Dirección', 'Contacto', 'Fecha de creación', 'Acciones']">

            <template #rows>
                <tr v-for="branch in filteredBranches" :key="branch.id"
                    class="hover:bg-gray-50 transition-colors cursor-pointer"
                    @click="navigateTo(`/customers/${customerId}/branches/${branch.id}`)">
                    <td class="px-6 py-4">
                        <p class="font-medium text-gray-900">{{ branch.name }}</p>
                        <p class="text-xs text-gray-400">ID: {{ branch.id }}</p>
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