<script setup lang="ts">
const props = defineProps<{
    show: boolean
    mode?: 'create' | 'edit'
    initialData?: {
        firstName: string;
        lastName: string;
        email: string;
        role: string
    }
}>()

const emit = defineEmits<{
    close: []
    submit: [data: object]
}>()

const roles = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'operator', label: 'Operator' },
    { value: 'viewer', label: 'Viewer' },
]

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'viewer',
})

const title = computed(() => props.mode === 'edit' ? 'Editar Usuario' : 'Agregar Usuario')
const submitLabel = computed(() => props.mode === 'edit' ? 'Guardar cambios' : 'Agregar')

function handleSubmit() {
    if (!form.value.firstName.trim() || !form.value.lastName.trim() || !form.value.email.trim()) return
    if (props.mode === 'create' && !form.value.password.trim()) return

    const body: Record<string, string> = {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        role: form.value.role,
    }

    // en edición solo enviar password si se llenó
    if (form.value.password.trim()) {
        body.password = form.value.password
    }

    emit('submit', body)
}

watch(() => props.show, (val) => {
    if (val) {
        form.value = {
            firstName: props.initialData?.firstName ?? '',
            lastName: props.initialData?.lastName ?? '',
            email: props.initialData?.email ?? '',
            password: '',
            role: props.initialData?.role ?? 'viewer',
        }
    }
})
</script>

<template>
    <UiBaseModal :show="show" :title="title" @close="emit('close')">
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                    <input v-model="form.firstName" type="text" placeholder="Nombre"
                        class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Apellido</label>
                    <input v-model="form.lastName" type="text" placeholder="Apellido"
                        class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input v-model="form.email" type="email" placeholder="correo@ejemplo.com"
                    class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Contraseña {{ mode === 'edit' ? '(dejar vacío para no cambiar)' : '' }}
                </label>
                <input v-model="form.password" type="password" placeholder="••••••••" autocomplete="new-password"
                    name="user-password"
                    class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Rol</label>
                <select v-model="form.role"
                    class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white">
                    <option v-for="role in roles" :key="role.value" :value="role.value">
                        {{ role.label }}
                    </option>
                </select>
            </div>
        </div>

        <template #footer>
            <UiBaseButton label="Cancelar" variant="ghost" @click="emit('close')" />
            <UiBaseButton :label="submitLabel" @click="handleSubmit" />
        </template>
    </UiBaseModal>
</template>