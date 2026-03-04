<script setup lang="ts">
defineProps<{
    rows?: number
    cols?: number
}>()
</script>

<template>
    <tr v-for="row in (rows ?? 5)" :key="row" class="animate-pulse">
        <td v-for="col in (cols ?? 4)" :key="col" class="px-6 py-4">
            <div class="flex items-center gap-3" v-if="col === 1">
                <div class="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                <div class="space-y-2 flex-1">
                    <div class="h-3 bg-gray-200 rounded w-32" />
                    <div class="h-2 bg-gray-100 rounded w-24" />
                </div>
            </div>
            <div v-else class="h-3 bg-gray-200 rounded" :class="col === cols ? 'w-16 ml-auto' : 'w-24'" />
        </td>
    </tr>
</template>