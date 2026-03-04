<script setup lang="ts">
defineProps<{
    title?: string
    variant?: 'default' | 'warning' | 'primary' | 'danger'
}>()

const variants = {
    default: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    warning: 'text-gray-400 hover:text-orange-500 hover:bg-orange-50',
    primary: 'text-gray-400 hover:text-blue-500 hover:bg-blue-50',
    danger: 'text-gray-400 hover:text-red-500 hover:bg-red-50',
}
</script>

<template>
    <button :title="title" :class="['p-2 rounded-md transition-colors cursor-pointer', variants[variant ?? 'default']]">
        <slot />
    </button>
</template>