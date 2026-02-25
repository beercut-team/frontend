import { apiInstance, API_URL } from "./base"
import type { APIResponse, Media } from "./types"

export const apiUploadMedia = (patientId: number, file: File, description?: string) => {
	const formData = new FormData()
	formData.append("file", file)
	if (description) formData.append("description", description)
	return apiInstance.post<APIResponse<Media>>(
		`/api/v1/patients/${patientId}/media`,
		formData,
		{ headers: { "Content-Type": "multipart/form-data" } },
	)
}

export const apiGetMedia = (patientId: number) =>
	apiInstance.get<APIResponse<Media[]>>(`/api/v1/patients/${patientId}/media`)

export const getMediaDownloadUrl = (patientId: number, mediaId: number) =>
	`${API_URL}/api/v1/patients/${patientId}/media/${mediaId}/download`

export const getMediaThumbnailUrl = (patientId: number, mediaId: number) =>
	`${API_URL}/api/v1/patients/${patientId}/media/${mediaId}/thumbnail`

export const apiDeleteMedia = (patientId: number, mediaId: number) =>
	apiInstance.delete<APIResponse<void>>(`/api/v1/patients/${patientId}/media/${mediaId}`)
