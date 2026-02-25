import { apiInstance } from "./base"
import type {
	APIResponse,
	Surgery,
	CreateSurgeryRequest,
	UpdateSurgeryRequest,
} from "./types"

export const apiGetSurgeries = (params?: {
	page?: number
	limit?: number
	status?: string
	surgeon_id?: number
}) => apiInstance.get<APIResponse<Surgery[]>>("/api/v1/surgeries", { params })

export const apiGetSurgery = (id: number) =>
	apiInstance.get<APIResponse<Surgery>>(`/api/v1/surgeries/${id}`)

export const apiCreateSurgery = (data: CreateSurgeryRequest) =>
	apiInstance.post<APIResponse<Surgery>>("/api/v1/surgeries", data)

export const apiUpdateSurgery = (id: number, data: UpdateSurgeryRequest) =>
	apiInstance.patch<APIResponse<Surgery>>(`/api/v1/surgeries/${id}`, data)
