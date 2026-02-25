import { apiInstance } from "./base"
import type {
	APIResponse,
	District,
	CreateDistrictRequest,
	UpdateDistrictRequest,
} from "./types"

export const apiGetDistricts = (params?: { page?: number; limit?: number }) =>
	apiInstance.get<APIResponse<District[]>>("/api/v1/districts", { params })

export const apiGetDistrict = (id: number) =>
	apiInstance.get<APIResponse<District>>(`/api/v1/districts/${id}`)

export const apiCreateDistrict = (data: CreateDistrictRequest) =>
	apiInstance.post<APIResponse<District>>("/api/v1/districts", data)

export const apiUpdateDistrict = (id: number, data: UpdateDistrictRequest) =>
	apiInstance.patch<APIResponse<District>>(`/api/v1/districts/${id}`, data)

export const apiDeleteDistrict = (id: number) =>
	apiInstance.delete<APIResponse<void>>(`/api/v1/districts/${id}`)
