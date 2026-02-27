import {
	apiGetPatients,
	apiGetPatient,
	apiGetPatientDashboard,
} from "@/shared/api"
import type { Patient, PatientDashboard, Meta } from "@/shared/api"

class PatientStore {
	patients = $state<Patient[]>([])
	currentPatient = $state<Patient | null>(null)
	dashboard = $state<PatientDashboard | null>(null)
	meta = $state<Meta | null>(null)
	isLoading = $state(false)
	error = $state<string | null>(null)

	async fetchPatients(params?: {
		page?: number
		limit?: number
		status?: string
		search?: string
		district_id?: number
	}) {
		this.isLoading = true
		this.error = null
		try {
			const { data } = await apiGetPatients(params)
			this.patients = data.data
			this.meta = data.meta ?? null
		} catch (e: any) {
			this.error = e.response?.data?.detail ?? "Ошибка загрузки пациентов"
		} finally {
			this.isLoading = false
		}
	}

	async fetchPatient(id: number) {
		this.isLoading = true
		this.error = null
		try {
			const { data } = await apiGetPatient(id)
			this.currentPatient = data.data
		} catch (e: any) {
			this.error = e.response?.data?.detail ?? "Ошибка загрузки пациента"
		} finally {
			this.isLoading = false
		}
	}

	async fetchDashboard() {
		this.isLoading = true
		this.error = null
		try {
			const { data } = await apiGetPatientDashboard()
			// Backend returns map of status counts directly in data.data
			// Type assertion needed because API type doesn't match backend response
			const statusCounts = data.data as unknown as Record<string, number>

			// Calculate total from all status counts
			const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)

			this.dashboard = {
				total_patients: total,
				by_status: statusCounts,
				recent_patients: [],
			}
		} catch (e: any) {
			this.error = e.response?.data?.detail ?? "Ошибка загрузки дашборда"
			this.dashboard = {
				total_patients: 0,
				by_status: {},
				recent_patients: [],
			}
		} finally {
			this.isLoading = false
		}
	}
}

export const patientStore = new PatientStore()
