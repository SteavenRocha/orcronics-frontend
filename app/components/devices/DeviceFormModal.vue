<script setup lang="ts">
import type { Device } from '~/types/device'

const props = defineProps<{
    show: boolean
    mode?: 'create' | 'edit'
    initialData?: Partial<Device>
}>()

const emit = defineEmits<{
    close: []
    submit: [data: {
        name: string
        type: string
        serial: string | null
        username: string | null
        password: string | null
        notes: string | null
        metadata: { field: string; value: string }[]
    }]
}>()

const form = ref({
    name: '',
    type: '',
    serial: '',
    username: '',
    password: '',
    notes: '',
})

const showPassword = ref(false)

const metadata = ref<{ field: string; value: string }[]>([])

const inputRef = ref<HTMLInputElement | null>(null)

const title = computed(() => props.mode === 'edit' ? 'Editar Dispositivo' : 'Agregar Dispositivo')
const submitLabel = computed(() => props.mode === 'edit' ? 'Guardar cambios' : 'Agregar')

function addMetadata() {
    metadata.value.push({ field: '', value: '' })
}

function removeMetadata(index: number) {
    metadata.value.splice(index, 1)
}

function handleSubmit() {
    if (!form.value.name.trim() || !form.value.type.trim()) return
    emit('submit', {
        name: form.value.name,
        type: form.value.type,
        serial: form.value.serial || null,
        username: form.value.username || null,
        password: form.value.password || null,
        notes: form.value.notes || null,
        metadata: metadata.value.filter(m => m.field.trim() && m.value.trim()),
    })
}

watch(() => props.show, (val) => {
    if (val) {
        showPassword.value = false
        form.value = {
            name: props.initialData?.name ?? '',
            type: props.initialData?.type ?? '',
            serial: props.initialData?.serial ?? '',
            username: props.initialData?.username ?? '',
            password: props.initialData?.password ?? '',
            notes: props.initialData?.notes ?? '',
        }
        metadata.value = props.initialData?.metadata?.map(m => ({ field: m.field, value: m.value })) ?? []
        nextTick(() => inputRef.value?.focus())
    } else {
        form.value = { name: '', type: '', serial: '', username: '', password: '', notes: '' }
        metadata.value = []
    }
})
</script>

<template>
    <UiBaseModal :show="show" :title="title" size="lg" @close="emit('close')">
        <div class="space-y-4">

            <!-- NOMBRE Y TIPO -->
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        Nombre <span class="text-red-500">*</span>
                    </label>
                    <input ref="inputRef" v-model="form.name" type="text" placeholder="Nombre del dispositivo"
                        class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        Tipo <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.type" type="text" placeholder="Tipo de dispositivo"
                        class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
            </div>

            <!-- SERIAL -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Número de serie</label>
                <input v-model="form.serial" type="text" placeholder="Número de serie del dispositivo"
                    class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <!-- CREDENCIALES -->
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Usuario</label>
                    <input v-model="form.username" type="text" placeholder="Usuario"
                        class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                    <div class="relative">
                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                            placeholder="Contraseña" autocomplete="new-password"
                            class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary pr-9" />
                        <button type="button"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            @click="showPassword = !showPassword">
                            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                                <path
                                    d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                                <path d="m2 2 20 20" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- NOTAS -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Notas</label>
                <textarea v-model="form.notes" placeholder="Notas adicionales" rows="4"
                    class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>

            <!-- METADATA -->
            <div>
                <div class="flex items-center mb-3 gap-3">
                    <label class="block text-sm font-medium text-gray-700">Metadata</label>
                    <button type="button"
                        class="text-xs cursor-pointer text-primary hover:bg-gray-50 flex items-center gap-1 border rounded-md p-1"
                        @click="addMetadata">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                        </svg>
                        Agregar campo
                    </button>
                </div>

                <div v-if="metadata.length === 0"
                    class="text-sm text-gray-500 border border-gray-200 py-2 px-3 rounded-md">
                    No hay metadata. Haz clic en "Agregar campo" para añadir.
                </div>

                <div v-for="(item, index) in metadata" :key="index" class="flex items-center gap-2">
                    <input v-model="item.field" type="text" placeholder="Campo"
                        class="mb-2 w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                    <input v-model="item.value" type="text" placeholder="Valor"
                        class="mb-2 w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />

                    <UiIconButton title="Eliminar" variant="danger" @click="removeMetadata(index)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </UiIconButton>
                </div>
            </div>

        </div>

        <template #footer>
            <UiBaseButton label="Cancelar" variant="ghost" @click="emit('close')" />
            <UiBaseButton :label="submitLabel" @click="handleSubmit" />
        </template>
    </UiBaseModal>
</template>