export default defineNuxtRouteMiddleware((to) => {
    const { getAccessToken, fetchUser, user } = useAuth()

    const publicRoutes = ['/login']

    if (publicRoutes.includes(to.path)) {
        const token = getAccessToken()
        if (token) return navigateTo('/dashboard')
        return
    }

    const token = getAccessToken()
    if (!token) return navigateTo('/login')

    if (!user.value) {
        fetchUser()
    }
})