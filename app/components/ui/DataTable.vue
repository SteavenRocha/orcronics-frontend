<script setup lang="ts">
import type { Meta } from '~/types/pagination'

const props = defineProps<{
    loading: boolean
    empty: boolean
    searchPlaceholder?: string
    meta?: Meta
    currentPage?: number
    columns: string[]
}>()

const colSpan = computed(() => props.columns.length)

const emit = defineEmits<{
    search: [value: string]
    pageChange: [page: number]
}>()

const searchQuery = defineModel<string>('search', { default: '' })
</script>

<template>
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">

        <!-- BUSCADOR -->
        <div class="p-4 border-b border-gray-200">
            <div class="relative w-72">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input v-model="searchQuery" type="text" :placeholder="searchPlaceholder ?? 'Buscar...'"
                    class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
        </div>

        <!-- TABLA -->
        <div class="overflow-y-auto max-h-[calc(100vh-400px)] personalized-scroll">
            <table class="w-full text-sm">

                <!-- ENCABEZADOS -->
                <thead class="bg-gray-50 sticky top-0 z-10 shadow-[0_1px_0_0_#e5e7eb]">
                    <tr>
                        <th v-for="col in columns" :key="col"
                            class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {{ col }}
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-100">
                    <!-- LOADING -->
                    <UiTableSkeleton v-if="loading" :rows="10" :cols="colSpan" />

                    <!-- EMPTY -->
                    <tr v-else-if="empty">
                        <td :colspan="colSpan" class="px-6 py-16 text-center text-sm text-gray-400">
                            No se encontraron resultados
                        </td>
                    </tr>

                    <!-- FILAS -->
                    <template v-else>
                        <slot name="rows" />
                    </template>
                </tbody>

            </table>
        </div>

        <!-- PAGINACIÓN -->
        <UiPagination v-if="meta && meta.totalPages > 1" :current-page="currentPage ?? 1" :total-pages="meta.totalPages"
            :total="meta.total" :limit="meta.limit" :has-next-page="meta.hasNextPage" :has-prev-page="meta.hasPrevPage"
            @change="emit('pageChange', $event)" />

    </div>
</template>