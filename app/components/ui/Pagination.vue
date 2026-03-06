<script setup lang="ts">
const props = defineProps<{
    currentPage: number
    totalPages: number
    total: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
}>()

const emit = defineEmits<{
    change: [page: number]
}>()

const from = computed(() => (props.currentPage - 1) * props.limit + 1)
const to = computed(() => Math.min(props.currentPage * props.limit, props.total))
</script>

<template>
    <div class="flex items-center justify-between px-6 py-4 border-t bg-gray-50 border-gray-200">

        <!-- INFO -->
        <p class="text-sm text-gray-500">
            Mostrando <span class="font-medium text-gray-700">{{ from }}</span> al
            <span class="font-medium text-gray-700">{{ to }}</span> de
            <span class="font-medium text-gray-700">{{ total }}</span> registros
        </p>

        <!-- CONTROLES -->
        <div class="flex items-center gap-2">
            <UiIconButton :disabled="!hasPrevPage" @click="emit('change', currentPage - 1)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-chevron-left" aria-hidden="true">
                    <path d="m15 18-6-6 6-6"></path>
                </svg>
            </UiIconButton>

            <span class="text-sm text-gray-600 px-2">
                Página <span class="font-medium text-gray-800">{{ currentPage }}</span> de
                <span class="font-medium text-gray-800">{{ totalPages }}</span>
            </span>

            <UiIconButton :disabled="!hasNextPage" @click="emit('change', currentPage + 1)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-chevron-right" aria-hidden="true">
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
            </UiIconButton>
        </div>

    </div>
</template>