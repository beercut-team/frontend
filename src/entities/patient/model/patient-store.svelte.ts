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
		try {
			const { data } = await apiGetPatientDashboard()
			this.dashboard = data.data
		} catch (e: any) {
			this.error = e.response?.data?.detail ?? "Ошибка загрузки дашборда"
		} finally {
			this.isLoading = false
		}
	}
}

export const patientStore = new PatientStore()
