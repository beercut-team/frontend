import { apiInstance } from "./base"
import type {
	APIResponse,
	ChecklistItem,
	UpdateChecklistItemRequest,
	ReviewChecklistItemRequest,
	ChecklistProgress,
} from "./types"

export const apiGetChecklist = (patientId: number) =>
	apiInstance.get<APIResponse<ChecklistItem[]>>(`/api/v1/patients/${patientId}/checklist`)

export const apiGetChecklistProgress = (patientId: number) =>
	apiInstance.get<APIResponse<ChecklistProgress>>(`/api/v1/patients/${patientId}/checklist/progress`)

export const apiUpdateChecklistItem = (patientId: number, itemId: number, data: UpdateChecklistItemRequest) =>
	apiInstance.patch<APIResponse<ChecklistItem>>(`/api/v1/patients/${patientId}/checklist/${itemId}`, data)

export const apiReviewChecklistItem = (patientId: number, itemId: number, data: ReviewChecklistItemRequest) =>
	apiInstance.post<APIResponse<ChecklistItem>>(`/api/v1/patients/${patientId}/checklist/${itemId}/review`, data)
