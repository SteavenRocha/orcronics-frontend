<script setup lang="ts">
import type { Customer } from '~/types/customer'
import { useCustomersService } from '~/api/customers.service'
import { onClickOutside } from '@vueuse/core';

const props = defineProps<{
    modelValue: string | null
    placeholder?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string | null]
    'select': [customer: Customer]
}>()

const customersService = useCustomersService()

const isOpen = ref(false)
const search = ref('')
const customers = ref<Customer[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const selectedCustomer = ref<Customer | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

async function fetchCustomers(reset = false) {
    if (loading.value) return
    if (reset) {
        page.value = 1
        customers.value = []
        hasMore.value = true
    }
    if (!hasMore.value) return

    loading.value = true
    try {
        const response = await customersService.getAll(page.value, 5, search.value)
        customers.value = reset ? response.data : [...customers.value, ...response.data]
        hasMore.value = response.meta.hasNextPage
        page.value++
    } finally {
        loading.value = false
    }
}

function onFocus() {
    isOpen.value = true
    if (customers.value.length === 0) fetchCustomers(true)
}

function close() {
    isOpen.value = false
    // Si hay un cliente seleccionado, restaurar el nombre en el input
    if (selectedCustomer.value) {
        search.value = selectedCustomer.value.name
    }
}

function select(customer: Customer) {
    selectedCustomer.value = customer
    search.value = customer.name
    emit('update:modelValue', customer.id)
    emit('select', customer)
    isOpen.value = false
}

function onScroll(e: Event) {
    const el = e.target as HTMLElement
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20
    if (nearBottom && hasMore.value && !loading.value) fetchCustomers()
}

let debounceTimer: ReturnType<typeof setTimeout>
watch(search, (val) => {
    // Si el usuario borra el input, limpiar selección
    if (selectedCustomer.value && val !== selectedCustomer.value.name) {
        selectedCustomer.value = null
        emit('update:modelValue', null)
    }
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        if (isOpen.value) fetchCustomers(true)
    }, 300)
})

onClickOutside(containerRef, close)
</script>

<template>
    <div class="relative" ref="containerRef">
        <!-- Input directo -->
        <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-gray-400">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </div>
            <input ref="inputRef" v-model="search" type="text" :placeholder="placeholder ?? 'Buscar cliente...'"
                class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                @focus="onFocus" />
        </div>

        <!-- Dropdown -->
        <ul v-if="isOpen"
            class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
            @scroll="onScroll">

            <li v-for="customer in customers" :key="customer.id">
                <button type="button"
                    class="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
                    :class="modelValue === customer.id ? 'text-primary font-medium' : 'text-gray-700'"
                    @click="select(customer)">
                    {{ customer.name }}
                    <svg v-if="modelValue === customer.id" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                </button>
            </li>

            <li v-if="loading" class="px-3 py-2.5 text-sm text-gray-400 text-center">
                Cargando...
            </li>

            <li v-if="!loading && customers.length === 0" class="px-3 py-2.5 text-sm text-gray-400 text-center">
                No se encontraron clientes
            </li>
        </ul>
    </div>
</template>