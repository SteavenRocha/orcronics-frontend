<script setup lang="ts">
import type { Branch } from '~/types/branch'

const props = defineProps<{
    show: boolean
    mode?: 'create' | 'edit'
    initialData?: Partial<Branch>
}>()

const emit = defineEmits<{
    close: []
    submit: [data: { name: string; address: string; contact_name: string; contact_phone: string }]
}>()

const form = ref({
    name: '',
    address: '',
    contact_name: '',
    contact_phone: '',
})

const inputRef = ref<HTMLInputElement | null>(null)

const title = computed(() => props.mode === 'edit' ? 'Editar Sucursal' : 'Agregar Sucursal')
const submitLabel = computed(() => props.mode === 'edit' ? 'Guardar cambios' : 'Agregar')

function handleSubmit() {
    if (!form.value.name.trim()) return
    emit('submit', { ...form.value })
}

watch(() => props.show, (val) => {
    if (val) {
        form.value = {
            name: props.initialData?.name ?? '',
            address: props.initialData?.address ?? '',
            contact_name: props.initialData?.contact_name ?? '',
            contact_phone: props.initialData?.contact_phone ?? '',
        }
        nextTick(() => inputRef.value?.focus())
    } else {
        form.value = { name: '', address: '', contact_name: '', contact_phone: '' }
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
                <input ref="inputRef" v-model="form.name" type="text" placeholder="Nombre de la sucursal"
                    class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    @keyup.enter="handleSubmit" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Dirección</label>
                <input v-model="form.address" type="text" placeholder="Dirección de la sucursal"
                    class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre de contacto</label>
                    <input v-model="form.contact_name" type="text" placeholder="Nombre"
                        class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Teléfono de contacto</label>
                    <input v-model="form.contact_phone" type="text" placeholder="Teléfono"
                        class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
            </div>

        </div>

        <template #footer>
            <UiBaseButton label="Cancelar" variant="ghost" @click="emit('close')" />
            <UiBaseButton :label="submitLabel" @click="handleSubmit" />
        </template>
    </UiBaseModal>
</template>