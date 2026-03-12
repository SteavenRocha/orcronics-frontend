export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiBaseUrl,

    onRequest({ options }) {
      const token = import.meta.client
        ? localStorage.getItem('access_token')
        : null

      if (token) {
        options.headers = new Headers(options.headers as HeadersInit)
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        const refresh_token = import.meta.client
          ? localStorage.getItem('refresh_token')
          : null

        if (!refresh_token) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          await navigateTo('/login')
          return
        }

        try {
          const tokens = await $fetch<{ access_token: string; refresh_token: string }>(
            `${useRuntimeConfig().public.apiBaseUrl}/auth/refresh`,
            {
              method: 'POST',
              headers: { Authorization: `Bearer ${refresh_token}` },
            }
          )
          localStorage.setItem('access_token', tokens.access_token)
          localStorage.setItem('refresh_token', tokens.refresh_token)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          await navigateTo('/login')
        }
      }
    },
  })

  nuxtApp.provide('api', api)
})