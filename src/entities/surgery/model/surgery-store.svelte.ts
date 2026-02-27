import { apiGetSurgeries } from "@/shared/api"
import type { Surgery } from "@/shared/api"

class SurgeryStore {
	surgeries = $state<Surgery[]>([])
	isLoading = $state(false)
	error = $state<string | null>(null)

	async fetchSurgeries(params?: { status?: string; surgeon_id?: number; limit?: number }) {
		this.isLoading = true
		this.error = null
		try {
			const { data } = await apiGetSurgeries({
				limit: params?.limit ?? 100,
				status: params?.status,
				surgeon_id: params?.surgeon_id
			})
			this.surgeries = data.data
		} catch (e: any) {
			this.error = e.response?.data?.detail ?? "Ошибка загрузки операций"
		} finally {
			this.isLoading = false
		}
	}
}

export const surgeryStore = new SurgeryStore()
