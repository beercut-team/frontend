import { apiInstance } from "./base"
import type {
	APIResponse,
	ChecklistItem,
	UpdateChecklistItemRequest,
	ReviewChecklistItemRequest,
	ChecklistProgress,
} from "./types"

export const apiGetChecklist = (patientId: number) =>
	apiInstance.get<APIResponse<ChecklistItem[]>>(`/api/v1/checklists/patient/${patientId}`)

export const apiGetChecklistProgress = (patientId: number) =>
	apiInstance.get<APIResponse<ChecklistProgress>>(`/api/v1/checklists/patient/${patientId}/progress`)

export const apiUpdateChecklistItem = (itemId: number, data: UpdateChecklistItemRequest) =>
	apiInstance.patch<APIResponse<ChecklistItem>>(`/api/v1/checklists/${itemId}`, data)

export const apiReviewChecklistItem = (itemId: number, data: ReviewChecklistItemRequest) =>
	apiInstance.post<APIResponse<ChecklistItem>>(`/api/v1/checklists/${itemId}/review`, data)
