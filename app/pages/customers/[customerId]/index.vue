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
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">

            <!-- BUSCADOR -->
            <div class="p-4 border-b border-gray-200">
                <div class="relative w-72">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input v-model="searchQuery" type="text" placeholder="Buscar sucursales..."
                        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
            </div>

            <!-- TABLA -->
            <div class="overflow-y-auto max-h-[calc(100vh-325px)] table-scroll">
                <table class="w-full text-sm">
                    <thead class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-[0_1px_0_0_#e5e7eb]">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Sucursal</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Dirección</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Contacto</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Fecha
                                de creación</th>
                            <th
                                class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">

                        <!-- LOADING -->
                        <UiTableSkeleton v-if="loading" :rows="10" :cols="5" />

                        <!-- EMPTY -->
                        <tr v-else-if="filteredBranches.length === 0">
                            <td colspan="5" class="px-6 py-16 text-center text-sm text-gray-400">
                                No se encontraron sucursales
                            </td>
                        </tr>

                        <!-- FILAS -->
                        <tr v-else v-for="branch in filteredBranches" :key="branch.id"
                            class="hover:bg-gray-50 transition-colors cursor-pointer"
                            @click="navigateTo(`/customers/${customerId}/branches/${branch.id}`)">
                            <td class="px-6 py-4">
                                <p class="font-medium text-gray-900">{{ branch.name }}</p>
                                <p class="text-xs text-gray-400">ID: {{ branch.id }}</p>
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                {{ branch.address ?? '—' }}
                            </td>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path
                                                d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                        </svg>
                                    </UiIconButton>
                                    <UiIconButton title="Eliminar" variant="danger">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round">
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

                    </tbody>
                </table>
            </div>

            <!-- PAGINACIÓN -->
            <UiPagination v-if="meta.totalPages > 1" :current-page="currentPage" :total-pages="meta.totalPages"
                :total="meta.total" :limit="meta.limit" :has-next-page="meta.hasNextPage"
                :has-prev-page="meta.hasPrevPage" @change="goToPage" />

        </div>
    </div>
</template>