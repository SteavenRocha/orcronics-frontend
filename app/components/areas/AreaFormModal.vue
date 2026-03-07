<script setup lang="ts">
import type { Area } from '~/types/area'

const props = defineProps<{
    show: boolean
    mode?: 'create' | 'edit'
    initialData?: Partial<Area>
}>()

const emit = defineEmits<{
    close: []
    submit: [data: { name: string; description: string }]
}>()

const form = ref({
    name: '',
    description: '',
})

const inputRef = ref<HTMLInputElement | null>(null)

const title = computed(() => props.mode === 'edit' ? 'Editar Area' : 'Agregar Area')
const submitLabel = computed(() => props.mode === 'edit' ? 'Guardar cambios' : 'Agregar')

function handleSubmit() {
    if (!form.value.name.trim()) return
    emit('submit', { ...form.value })
}

watch(() => props.show, (val) => {
    if (val) {
        form.value = {
            name: props.initialData?.name ?? '',
            description: props.initialData?.description ?? '',
        }
        nextTick(() => inputRef.value?.focus())
    } else {
        form.value = { name: '', description: '' }
    }
})
</script>

<template>
    <UiBaseModal :show="show" :title="title" @close="emit('close')">
        <div class="space-y-4">

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Nombre <span class="text-red-500">*</span>
                </label>
                <input ref="inputRef" v-model="form.name" type="text" placeholder="Nombre del area"
                    class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    @keyup.enter="handleSubmit" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                <textarea v-model="form.description" placeholder="Descripción del área" rows="4"
                    class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>

        </div>

        <template #footer>
            <UiBaseButton label="Cancelar" variant="ghost" @click="emit('close')" />
            <UiBaseButton :label="submitLabel" @click="handleSubmit" />
        </template>
    </UiBaseModal>
</template>