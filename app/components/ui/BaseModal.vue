<script setup lang="ts">
defineProps<{
    show: boolean
    title: string
    size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{
    close: []
}>()

const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
}
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition duration-200 ease-out"
            leave-active-class="transition duration-150 ease-in" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show"
                class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                @click.self="emit('close')">

                <Transition enter-active-class="transition duration-300 ease-out"
                    leave-active-class="transition duration-200 ease-in" enter-from-class="translate-y-8"
                    enter-to-class="translate-y-0" leave-from-class="translate-y-0" leave-to-class="translate-y-8"
                    appear>
                    <div :class="['bg-white rounded-2xl shadow-xl w-full', sizes[size ?? 'md']]">

                        <!-- HEADER -->
                        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
                            <UiIconButton title="Cerrar" variant="default" @click="emit('close')">
                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </UiIconButton>
                        </div>

                        <!-- CONTENT -->
                        <div class="px-6 py-4">
                            <slot />
                        </div>

                        <!-- FOOTER -->
                        <div v-if="$slots.footer"
                            class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                            <slot name="footer" />
                        </div>

                    </div>
                </Transition>

            </div>
        </Transition>
    </Teleport>
</template>