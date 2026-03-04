<script setup lang="ts">
defineProps<{
    label: string
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    icon?: string
    type?: 'button' | 'submit' | 'reset'
}>()

const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
}
</script>

<template>
    <button :type="type ?? 'button'"
        :class="['flex items-center gap-2 px-3 py-3 text-sm font-medium rounded-md transition-colors cursor-pointer', variants[variant ?? 'primary']]">
        <slot name="icon" />
        {{ label }}
    </button>
</template>