<script setup lang="ts">
const props = defineProps<{
    to: string
    label: string
    exact?: boolean
}>()

const route = useRoute()

const isActive = computed(() => {
    if (props.exact) return route.path === props.to
    return route.path === props.to || route.path.startsWith(props.to + '/')
})
</script>

<template>
    <NuxtLink :to="to" :class="['flex items-center px-3 py-3.5 rounded-md group transition-colors',
        isActive
            ? 'bg-neutral-tertiary text-primary'
            : 'text-body hover:bg-neutral-tertiary hover:text-primary'
    ]">
        <slot name="icon" />
        <span class="flex-1 ms-3 whitespace-nowrap">{{ label }}</span>
        <slot name="badge" />
    </NuxtLink>
</template>