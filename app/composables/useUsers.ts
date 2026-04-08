
import { useUsersService } from '~/api/users.service'
import type { User } from '~/types/user'
import type { Meta } from '~/types/pagination'

export function useUsers() {
    const usersService = useUsersService()

    const users = ref<User[]>([])
    const loading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const meta = ref<Meta>({
        total: 0, page: 1, limit: 10,
        totalPages: 1, hasNextPage: false, hasPrevPage: false
    })

    async function fetchUsers(page = 1) {
        loading.value = true
        try {
            const response = await usersService.getAll(page, 10, searchQuery.value)
            users.value = response.data
            meta.value = response.meta
            currentPage.value = page
        } catch (e) {
            console.error('Error fetching users:', e)
        } finally {
            loading.value = false
        }
    }

    async function createUser(body: object) {
        await usersService.create(body)
        await fetchUsers(1)
    }

    async function updateUser(id: string, body: object) {
        const updated = await usersService.update(id, body)
        const index = users.value.findIndex(u => u.id === id)
        if (index !== -1) users.value[index] = updated
    }

    async function updateStatus(id: string, isActive: boolean) {
        await usersService.updateStatus(id, isActive)
        const user = users.value.find(u => u.id === id)
        if (user) user.isActive = isActive
    }

    async function removeUser(id: string) {
        await usersService.remove(id)
        if (users.value.length === 1 && currentPage.value > 1) {
            await fetchUsers(currentPage.value - 1)
        } else {
            await fetchUsers(currentPage.value)
        }
    }

    async function goToPage(page: number) {
        if (page < 1 || page > meta.value.totalPages) return
        await fetchUsers(page)
    }

    watch(searchQuery, () => {
        fetchUsers(1)
    })

    return {
        users,
        loading,
        searchQuery,
        meta,
        currentPage,
        fetchUsers,
        createUser,
        updateUser,
        removeUser,
        updateStatus,
        goToPage,
    }
}