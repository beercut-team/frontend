import {
	apiGetDistricts,
	apiCreateDistrict,
	apiUpdateDistrict,
	apiDeleteDistrict,
} from "@/shared/api"
import type { District, CreateDistrictRequest, UpdateDistrictRequest } from "@/shared/api"

class DistrictStore {
	districts = $state<District[]>([])
	isLoading = $state(false)
	error = $state<string | null>(null)

	async fetchDistricts() {
		this.isLoading = true
		this.error = null
		try {
			const { data } = await apiGetDistricts({ limit: 100 })
			this.districts = data.data
		} catch (e: any) {
			this.error = e.response?.data?.detail ?? "Ошибка загрузки районов"
		} finally {
			this.isLoading = false
		}
	}

	async create(req: CreateDistrictRequest) {
		const { data } = await apiCreateDistrict(req)
		this.districts = [...this.districts, data.data]
		return data.data
	}

	async update(id: number, req: UpdateDistrictRequest) {
		const { data } = await apiUpdateDistrict(id, req)
		this.districts = this.districts.map((d) => (d.id === id ? data.data : d))
		return data.data
	}

	async remove(id: number) {
		await apiDeleteDistrict(id)
		this.districts = this.districts.filter((d) => d.id !== id)
	}
}

export const districtStore = new DistrictStore()
