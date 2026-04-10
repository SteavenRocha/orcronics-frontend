<script setup lang="ts">
defineProps<{
    label: string
}>()

const isOpen = ref(false)
</script>

<template>
    <div>
        <button
            class="cursor-pointer flex items-center px-3 py-3.5 rounded-md group transition-colors w-full text-body hover:bg-neutral-tertiary hover:text-primary"
            @click="isOpen = !isOpen">
            <slot name="icon" />
            <span class="flex flex-1 ms-3 whitespace-nowrap">{{ label }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                :class="['transition-transform duration-200', isOpen ? 'rotate-180' : '']">
                <path d="m6 9 6 6 6-6" />
            </svg>
        </button>

        <div v-show="isOpen" class="mt-1 ml-3 pl-3 space-y-1">
            <slot />
        </div>
    </div>
</template>