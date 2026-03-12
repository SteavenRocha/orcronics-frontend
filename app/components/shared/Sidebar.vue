<template>
    <aside id="top-bar-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar">
        <div class="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default flex flex-col">
            <ul class="space-y-1.5 mt-18 font-medium flex-1">
                <li>
                    <UiSideBarLink to="/dashboard" label="Dashboard" :exact="true">
                        <template #icon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-house _icon_1gsq5_241" aria-hidden="true">
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                                <path
                                    d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
                                </path>
                            </svg>
                        </template>
                    </UiSideBarLink>
                </li>
                <li>
                    <UiSideBarLink to="/customers" label="Clientes">
                        <template #icon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-building2 lucide-building-2 _icon_1gsq5_241" aria-hidden="true">
                                <path d="M10 12h4"></path>
                                <path d="M10 8h4"></path>
                                <path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                                <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2">
                                </path>
                                <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
                            </svg>
                        </template>
                        <template #badge>
                            <span
                                class="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded-sm">New</span>
                        </template>
                    </UiSideBarLink>
                </li>
                <li>
                    <UiSideBarLink to="/users" label="Usuarios">
                        <template #icon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-users _icon_1gsq5_241" aria-hidden="true">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                            </svg>
                        </template>
                    </UiSideBarLink>
                </li>
            </ul>
        </div>
    </aside>
</template>