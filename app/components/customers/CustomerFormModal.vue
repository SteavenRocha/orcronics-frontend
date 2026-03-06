<script setup lang="ts">
const props = defineProps<{
    show: boolean
    mode?: 'create' | 'edit'
    initialName?: string
}>()

const emit = defineEmits<{
    close: []
    submit: [name: string]
}>()

const form = ref({ name: '' })
const inputRef = ref<HTMLInputElement | null>(null)

const title = computed(() => props.mode === 'edit' ? 'Editar Cliente' : 'Agregar Cliente')
const submitLabel = computed(() => props.mode === 'edit' ? 'Guardar cambios' : 'Agregar')

function handleSubmit() {
    if (!form.value.name.trim()) return
    emit('submit', form.value.name)
    form.value.name = ''
}

watch(() => props.show, (val) => {
    if (val) {
        form.value.name = props.initialName ?? ''
        nextTick(() => inputRef.value?.focus())
    } else {
        form.value.name = ''
    }
})
</script>

<template>
    <UiBaseModal :show="show" :title="title" @close="emit('close')">
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                <input ref="inputRef" v-model="form.name" type="text" placeholder="Nombre del cliente"
                    class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    @keyup.enter="handleSubmit" />
            </div>
        </div>

        <template #footer>
            <UiBaseButton label="Cancelar" variant="ghost" @click="emit('close')" />
            <UiBaseButton :label="submitLabel" @click="handleSubmit" />
        </template>
    </UiBaseModal>
</template>