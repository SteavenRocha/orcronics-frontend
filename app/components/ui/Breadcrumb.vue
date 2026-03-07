<script setup lang="ts">
defineProps<{
    items: {
        label: string;
        icon?: boolean;
        to?: string
    }[]
}>()
</script>

<template>
    <nav class="flex items-center gap-1.5 text-sm">
        <template v-for="(item, index) in items" :key="index">
            <NuxtLink v-if="item.to" :to="item.to"
                class="text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                <svg v-if="item.icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-house" aria-hidden="true">
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                    <path
                        d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
                    </path>
                </svg>
                <span v-else>{{ item.label }}</span>
            </NuxtLink>
            <span v-else class="text-gray-700 font-medium flex items-center gap-1">
                <svg v-if="item.icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-house" aria-hidden="true">
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                    <path
                        d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
                    </path>
                </svg>
                <span v-else>{{ item.label }}</span>
            </span>
            <span v-if="index < items.length - 1" class="text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-chevron-right _separator_1shdt_61" aria-hidden="true">
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
            </span>
        </template>
    </nav>
</template>