<script setup lang="ts">
import type { Customer } from '~/types/customer';

const props = defineProps<{
    show: boolean
    mode?: 'create' | 'edit'
    initialName?: string
}>()

const emit = defineEmits<{
    close: []
    submit: [customerId: string]
}>()

const form = ref({
    customerId: null as string | null,
})
const inputRef = ref<HTMLInputElement | null>(null)

const title = computed(() => props.mode === 'edit' ? 'Editar Suscripción' : 'Nueva Suscripción')
const submitLabel = computed(() => props.mode === 'edit' ? 'Guardar cambios' : 'Agregar')

function handleSubmit() {
    if (!form.value.customerId) return
    emit('submit', form.value.customerId)
    form.value.customerId = null
}

watch(() => props.show, (val) => {
    if (val) {
        form.value.customerId = props.initialName ?? ''
        nextTick(() => inputRef.value?.focus())
    } else {
        form.value.customerId = ''
    }
})

function onSelectCustomer(customer: Customer) {
    form.value.customerId = customer.id
}
</script>

<template>
    <UiBaseModal :show="show" :title="title" @close="emit('close')">
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Buscar cliente <span class="text-red-500">*</span>
                </label>
                <UiSelectSearch v-model="form.customerId" @select="onSelectCustomer" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Detalles de la suscripción <span class="text-red-500">*</span>
                </label>

                <div class="w-100 h-80"></div>
            </div>
        </div>

        <template #footer>
            <UiBaseButton label="Cancelar" variant="ghost" @click="emit('close')" />
            <UiBaseButton :label="submitLabel" @click="handleSubmit" />
        </template>
    </UiBaseModal>
</template>