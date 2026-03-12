<script setup lang="ts">
import type { Login } from '~/types/auth'

definePageMeta({
    layout: false,
})

const { login } = useAuth()

const form = reactive<Login>({
    email: '',
    password: '',
})

const errors = reactive({
    email: '',
    password: '',
})

const showPassword = ref(false)
const isLoading = ref(false)
const loginError = ref('')

function validate(): boolean {
    errors.email = ''
    errors.password = ''

    if (!form.email.trim()) {
        errors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'El email no es válido'
    }

    if (!form.password) {
        errors.password = 'La contraseña es requerida'
    } else if (form.password.length < 8) {
        errors.password = 'Mínimo 8 caracteres'
    }

    return !errors.email && !errors.password
}

async function handleLogin() {
    if (!validate()) return

    isLoading.value = true
    loginError.value = ''

    try {
        await login(form)
        await navigateTo('/dashboard')
    } catch (error: any) {
        const status = error?.response?.status

        if (status === 400) {
            loginError.value = 'El email o contraseña no tienen el formato correcto.'
        } else if (status === 401) {
            loginError.value = 'Email o contraseña incorrectos.'
        } else {
            loginError.value = 'Error al conectar con el servidor. Intenta nuevamente.'
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex">

        <!-- Panel izquierdo: branding con gradiente azul -->
        <div
            class="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-start p-12 overflow-hidden bg-linear-to-br from-orange-600 via-orange-500 to-orange-600">

            <!-- Patrón sutil -->
            <div class="absolute inset-0 opacity-5"
                style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;" />

            <div class="relative z-10 flex flex-col">
                <!-- Logo -->
                <div class="w-15 h-15 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-4">
                    <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                </div>

                <h1 class="text-5xl font-bold text-white leading-tight">
                    ERP Orcronics
                </h1>
                <p class="text-white/80 text-lg mt-2">
                    Plataforma de Gestión Empresarial
                </p>
            </div>

            <!-- Footer -->
            <div class="absolute bottom-6 z-10">
                <p class="text-white/60 text-xs">© 2026 Orcronics ERP v0.1</p>
            </div>
        </div>

        <!-- Panel derecho: fondo gris claro -->
        <div class="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6">
            <div class="w-full max-w-sm">

                <!-- Card del formulario -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

                    <!-- Header -->
                    <div class="text-center mb-7">
                        <!-- Logo móvil -->
                        <div class="flex items-center justify-center gap-2 mb-6 lg:hidden">
                            <div class="w-10 h-10 rounded-md flex items-center justify-center bg-primary">
                                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                            </div>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
                        <p class="text-gray-400 text-sm mt-1">Ingresa tus datos para acceder</p>
                    </div>

                    <!-- Form -->
                    <form class="space-y-4" @submit.prevent="handleLogin">

                        <!-- Username -->
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700 mb-1.5">
                                Usuario <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                                <input id="username" v-model="form.email" type="text" autocomplete="username"
                                    placeholder="tu@usuario"
                                    class="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-md pl-9 pr-4 py-2.5 placeholder-gray-300 focus:outline-none focus:ring-1 focus:border-transparent transition-all"
                                    :class="errors.email ? 'border-red-400 focus:ring-red-400' : 'focus:ring-primary'" />
                            </div>
                            <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
                        </div>

                        <!-- Password -->
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">
                                Contraseña <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </div>
                                <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                    autocomplete="current-password" placeholder="••••••••"
                                    class="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-md pl-9 pr-10 py-2.5 placeholder-gray-300 focus:outline-none focus:ring-1 focus:border-transparent transition-all"
                                    :class="errors.password ? 'border-red-400 focus:ring-red-400' : 'focus:ring-primary'" />
                                <button type="button"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    @click="showPassword = !showPassword">
                                    <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                </button>
                            </div>
                            <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
                        </div>

                        <!-- Error general -->
                        <div v-if="loginError"
                            class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2.5 rounded-md">
                            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            {{ loginError }}
                        </div>

                        <!-- Submit -->
                        <button type="submit" :disabled="isLoading"
                            class="w-full cursor-pointer bg-primary hover:bg-primary-hover text-white font-medium text-sm py-2.5 px-4 rounded-md transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-60 disabled:cursor-not-allowed">
                            <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 14.627 0 12 0v4a8 8 0 00-8 8H4z" />
                            </svg>
                            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                            {{ isLoading ? 'Ingresando...' : 'Ingresar' }}
                        </button>

                    </form>
                </div>

                <p class="mt-5 text-center text-xs text-gray-400">
                    Solo para usuarios autorizados
                </p>

            </div>
        </div>

    </div>
</template>