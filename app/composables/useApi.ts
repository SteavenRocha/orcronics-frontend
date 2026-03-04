export function useApi() {
    const { public: { apiBaseUrl } } = useRuntimeConfig()
    return apiBaseUrl as string
}