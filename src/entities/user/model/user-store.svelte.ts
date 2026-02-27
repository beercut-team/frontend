import { apiGetUsers } from "@/shared/api"
import type { User } from "@/shared/api"

class UserStore {
	users = $state<User[]>([])
	isLoading = $state(false)
	error = $state<string | null>(null)

	async fetchUsers(params?: { role?: string; limit?: number }) {
		this.isLoading = true
		this.error = null
		try {
			const { data } = await apiGetUsers({ limit: params?.limit ?? 100, role: params?.role })
			this.users = data.data
		} catch (e: any) {
			this.error = e.response?.data?.detail ?? "Ошибка загрузки пользователей"
		} finally {
			this.isLoading = false
		}
	}
}

export const userStore = new UserStore()
