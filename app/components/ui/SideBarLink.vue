<script setup lang="ts">
defineProps<{
    to: string
    label: string
}>()
</script>

<template>
    <NuxtLink :to="to"
        class="flex items-center px-3 py-3 text-body rounded-md hover:bg-neutral-tertiary hover:text-fg-brand group"
        active-class="bg-neutral-tertiary text-fg-brand">
        <slot name="icon" />
        <span class="flex-1 ms-3 whitespace-nowrap">{{ label }}</span>
        <slot name="badge" />
    </NuxtLink>
</template>