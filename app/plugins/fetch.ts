export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiBaseUrl,

    onRequest({ options }) {
      const token = import.meta.client
        ? localStorage.getItem('accessToken')
        : null

      if (token) {
        options.headers = new Headers(options.headers as HeadersInit)
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        const refreshToken = import.meta.client
          ? localStorage.getItem('refreshToken')
          : null

        if (!refreshToken) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          await navigateTo('/login')
          return
        }

        try {
          const tokens = await $fetch<{ accessToken: string; refreshToken: string }>(
            `${useRuntimeConfig().public.apiBaseUrl}/auth/refresh`,
            {
              method: 'POST',
              headers: { Authorization: `Bearer ${refreshToken}` },
            }
          )
          localStorage.setItem('accessToken', tokens.accessToken)
          localStorage.setItem('refreshToken', tokens.refreshToken)
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          await navigateTo('/login')
        }
      }
    },
  })

  nuxtApp.provide('api', api)
})