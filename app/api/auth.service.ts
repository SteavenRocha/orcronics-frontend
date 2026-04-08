import type { AuthTokens, Login } from '~/types/auth'
import type { User } from '~/types/user'

export function useAuthService() {
    const { $api } = useNuxtApp()

    return {
        login: (body: Login) =>
            $api<AuthTokens>('/auth/login', { method: 'POST', body }),

        me: () =>
            $api<User>('/auth/me'),

        // Se usa en el plugin
        /*  refresh: (refresh_token: string) =>
             $fetch<AuthTokens>(`${useApi()}/auth/refresh`, {
                 method: 'POST',
                 headers: { Authorization: `Bearer ${refresh_token}` },
             }), */

        logout: () =>
            $api('/auth/logout', { method: 'POST' }),
    }
}