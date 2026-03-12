import { useAuthService } from '~/services/auth.service'
import type { Login } from '~/types/auth'
import type { User } from '~/types/user'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export function useAuth() {
    const user = useState<User | null>('auth:user', () => null)
    const isAuthenticated = computed(() => !!user.value)

    function getAccessToken(): string | null {
        if (import.meta.server) return null
        return localStorage.getItem(ACCESS_TOKEN_KEY)
    }

    function getRefreshToken(): string | null {
        if (import.meta.server) return null
        return localStorage.getItem(REFRESH_TOKEN_KEY)
    }

    function setTokens(access_token: string, refresh_token: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
    }

    function clearTokens(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
    }

    function setUser(data: User): void {
        user.value = data
    }

    function clearUser(): void {
        user.value = null
    }

    async function login(dto: Login): Promise<void> {
        const authService = useAuthService()
        const tokens = await authService.login(dto)
        setTokens(tokens.access_token, tokens.refresh_token)
        await fetchUser()
    }

    async function fetchUser(): Promise<void> {
        const token = getAccessToken()
        if (!token) return
        const authService = useAuthService()
        const data = await authService.me()
        setUser(data)
    }

    async function logout(): Promise<void> {
        try {
            const authService = useAuthService()
            await authService.logout()
        } finally {
            clearTokens()
            clearUser()
            await navigateTo('/login')
        }
    }

    return {
        user,
        isAuthenticated,
        getAccessToken,
        getRefreshToken,
        login,
        logout,
        fetchUser,
    }
}