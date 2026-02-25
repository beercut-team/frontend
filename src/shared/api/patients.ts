import { apiInstance } from "./base"
import type {
	APIResponse,
	Patient,
	CreatePatientRequest,
	UpdatePatientRequest,
	PatientStatusRequest,
	PatientDashboard,
	PatientPublicResponse,
} from "./types"

export const apiGetPatients = (params?: {
	page?: number
	limit?: number
	status?: string
	search?: string
	district_id?: number
}) => apiInstance.get<APIResponse<Patient[]>>("/api/v1/patients", { params })

export const apiGetPatient = (id: number) =>
	apiInstance.get<APIResponse<Patient>>(`/api/v1/patients/${id}`)

export const apiCreatePatient = (data: CreatePatientRequest) =>
	apiInstance.post<APIResponse<Patient>>("/api/v1/patients", data)

export const apiUpdatePatient = (id: number, data: UpdatePatientRequest) =>
	apiInstance.patch<APIResponse<Patient>>(`/api/v1/patients/${id}`, data)

export const apiChangePatientStatus = (id: number, data: PatientStatusRequest) =>
	apiInstance.post<APIResponse<Patient>>(`/api/v1/patients/${id}/status`, data)

export const apiGetPatientDashboard = () =>
	apiInstance.get<APIResponse<PatientDashboard>>("/api/v1/patients/dashboard")

export const apiGetPatientPublicStatus = (accessCode: string) =>
	apiInstance.get<APIResponse<PatientPublicResponse>>(`/api/v1/patients/public/${accessCode}`)
