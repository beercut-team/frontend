import { apiInstance } from "./base"
import type { APIResponse, User } from "./types"

export const apiGetUsers = (params?: {
	page?: number
	limit?: number
	role?: string
}) => apiInstance.get<APIResponse<User[]>>("/api/v1/admin/users", { params })

export const apiGetUser = (id: number) =>
	apiInstance.get<APIResponse<User>>(`/api/v1/admin/users/${id}`)
