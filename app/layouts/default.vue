<script setup lang="ts">
import { initFlowbite } from 'flowbite';
import { getInitials, getAvatarColor } from '~/utils/avatar'

const { user, logout } = useAuth()

const fullName = computed(() =>
    user.value ? `${user.value.first_name} ${user.value.last_name}` : ''
)

const initials = computed(() => getInitials(fullName.value))
const avatarColor = computed(() => getAvatarColor(fullName.value))

onMounted(() => {
    useFlowbite(() => {
        initFlowbite();
    })
})
</script>

<template>
    <div class="h-screen flex flex-col">
        <nav class="fixed top-0 z-50 w-full bg-neutral-primary-soft border-b border-default">
            <div class="px-3 py-3 lg:px-5 lg:pl-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center justify-start rtl:justify-end">
                        <button data-drawer-target="top-bar-sidebar" data-drawer-toggle="top-bar-sidebar"
                            aria-controls="top-bar-sidebar" type="button"
                            class="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none">
                            <span class="sr-only">Open sidebar</span>
                            <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                                    d="M5 7h14M5 12h14M5 17h10" />
                            </svg>
                        </button>
                        <NuxtLink to="/" class="flex ms-3 md:me-24">
                            <img src="../assets/img/logo.png" class="h-6 me-3" alt="Orcronics Logo" />
                            <span
                                class="self-center text-lg font-semibold whitespace-nowrap dark:text-white">Orcronics</span>
                        </NuxtLink>
                    </div>

                    <div class="flex items-center">
                        <div class="flex items-center ms-3">
                            <div>
                                <button type="button"
                                    class="cursor-pointer flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-neutral-secondary-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
                                    aria-expanded="false" data-dropdown-toggle="dropdown-user"
                                    data-dropdown-placement="bottom-end" data-dropdown-offset-skidding="5"
                                    data-dropdown-offset-distance="20">
                                    <!-- Avatar con iniciales -->
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-semibold"
                                        :style="{ backgroundColor: avatarColor }">
                                        {{ initials }}
                                    </div>
                                    <!-- Nombre y rol -->
                                    <div class="hidden md:flex flex-col items-start">
                                        <span class="text-sm font-medium text-heading leading-tight">{{ fullName
                                        }}</span>
                                        <span class="text-xs text-body capitalize leading-tight">
                                            {{ user?.role?.replace(/_/g, ' ') }}
                                        </span>
                                    </div>
                                    <!-- Chevron -->
                                    <svg class="w-3.5 h-3.5 text-body hidden md:block" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Dropdown -->
                            <div class="z-50 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-52"
                                id="dropdown-user">
                                <!-- Info usuario -->
                                <div class="px-4 py-3 border-b border-default-medium">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-semibold"
                                            :style="{ backgroundColor: avatarColor }">
                                            {{ initials }}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-heading truncate">{{ fullName }}</p>
                                            <p class="text-xs text-body capitalize truncate">{{
                                                user?.role?.replace(/_/g, ' ') }}</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- Opciones -->
                                <ul class="p-2 text-sm font-medium" role="none">
                                    <li>
                                        <button
                                            class="cursor-pointer inline-flex items-center gap-2 w-full p-2 text-body hover:bg-neutral-tertiary-medium hover:text-heading rounded transition-colors"
                                            role="menuitem" @click="logout">
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
                                            </svg>
                                            Cerrar sesión
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <SharedSidebar />

        <main class="sm:ml-64 mt-14 bg-gray-50 flex-1 overflow-y-auto p-8">
            <div class="max-w-7xl mx-auto">
                <slot />
            </div>
        </main>
    </div>
</template>