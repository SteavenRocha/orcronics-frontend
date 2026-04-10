import { toValue } from 'vue'
import type { User } from '~/types/user'
import type { Meta } from '~/types/pagination'
import { useEvihubUsersService } from '~/api/evihub-users.service'

export function useEvihubUsers(accountId: MaybeRef<string>) {
    const evihubUsersService = useEvihubUsersService()
    const users = ref<User[]>([])
    const loading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const meta = ref<Meta>({
        total: 0, page: 1, limit: 10,
        totalPages: 1, hasNextPage: false, hasPrevPage: false
    })

    async function fetchUsers(page = 1) {
        const id = toValue(accountId)
        if (!id) return

        loading.value = true
        try {
            const response = await evihubUsersService.getAllByAccount(id, page, 10, searchQuery.value)
            users.value = response.data
            meta.value = response.meta
            currentPage.value = page
        } catch (e) {
            console.error('Error fetching evihub users:', e)
        } finally {
            loading.value = false
        }
    }

    async function goToPage(page: number) {
        if (page < 1 || page > meta.value.totalPages) return
        await fetchUsers(page)
    }

    async function createUser(body: object) {
        try {
            await evihubUsersService.create(body)
            await fetchUsers(1)
        } catch (e) {
            console.error('Error creating evihub user:', e)
        }
    }

    async function updateStatus(id: string, isActive: boolean) {
        try {
            await evihubUsersService.updateStatus(id, isActive)
            const user = users.value.find(u => u.id === id)
            if (user) user.isActive = isActive
        } catch (e) {
            console.error('Error updating evihub user:', e)
        }
    }

    watch(searchQuery, () => fetchUsers(1))

    return {
        users,
        loading,
        searchQuery,
        meta,
        currentPage,
        fetchUsers,
        updateStatus,
        goToPage,
        createUser,
    }
}