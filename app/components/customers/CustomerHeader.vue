<script setup lang="ts">
import type { Customer } from '~/types/customer'

defineProps<{
    customer: Customer | null
    loading?: boolean
}>()
</script>

<template>
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden mb-10">
        <div class="p-5 flex items-center gap-4">

            <div :style="customer ? { backgroundColor: getAvatarColor(customer.name) } : {}"
                class="w-16 h-16 rounded-xl flex items-center justify-center text-white text-3xl shrink-0 border-2 border-white shadow-md">
                {{ customer ? getInitials(customer.name) : '' }}
            </div>

            <div>
                <div v-if="loading" class="animate-pulse space-y-2">
                    <div class="h-6 bg-gray-200 rounded w-40" />
                    <div class="h-4 bg-gray-100 rounded w-64" />
                </div>
                <template v-else>
                    <div class="flex items-center gap-2">
                        <h1 class="text-2xl font-semibold text-gray-900">{{ customer?.name }}</h1>
                        <span
                            :class="['px-2 py-0.5 rounded-full text-xs font-medium', customer?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
                            {{ customer?.is_active ? 'Activo' : 'Inactivo' }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs text-gray-400">ID: {{ customer?.id }}</span>
                        <span class="text-xs text-gray-400">|</span>
                        <span class="text-xs text-gray-400">Registrado el {{ customer ? formatDate(customer.created_at)
                            : '' }}</span>
                    </div>
                </template>
            </div>

        </div>
    </div>
</template>