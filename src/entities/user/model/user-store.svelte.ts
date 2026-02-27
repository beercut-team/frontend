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
			const response = await apiGetUsers({ limit: params?.limit ?? 100, role: params?.role })
			console.log('Users API response:', response)

			// Handle different response formats
			if (Array.isArray(response.data)) {
				// Direct array response
				this.users = response.data
			} else if (response.data?.data) {
				// Wrapped in data property
				this.users = Array.isArray(response.data.data) ? response.data.data : []
			} else {
				console.error('Unexpected response format:', response)
				this.error = "Неверный формат ответа API"
				this.users = []
			}
		} catch (e: any) {
			console.error('Error fetching users:', e)
			this.error = e.response?.data?.error || e.response?.data?.detail || e.message || "Ошибка загрузки пользователей"
			this.users = []
		} finally {
			this.isLoading = false
		}
	}
}

export const userStore = new UserStore()
