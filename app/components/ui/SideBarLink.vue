<script setup lang="ts">
import { resolveComponent } from 'vue'

const props = defineProps<{
    to?: string
    label: string
    exact?: boolean
}>()

const emit = defineEmits<{
    click: []
}>()

const NuxtLink = resolveComponent('NuxtLink')

const route = useRoute()

const isActive = computed(() => {
    if (!props.to) return false
    if (props.exact) return route.path === props.to
    return route.path === props.to || route.path.startsWith(props.to + '/')
})
</script>

<template>
    <component :is="to ? NuxtLink : 'button'" :to="to" :class="['cursor-pointer flex items-center px-3 py-3.5 rounded-md group transition-colors w-full',
        isActive
            ? 'bg-neutral-tertiary text-primary'
            : 'text-body hover:bg-neutral-tertiary hover:text-primary'
    ]" @click="emit('click')">
        <slot name="icon" />
        <span class="flex-1 ms-3 whitespace-nowrap">{{ label }}</span>
        <slot name="badge" />
    </component>
</template>