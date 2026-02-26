import { apiInstance, API_URL } from "./base"
import type { APIResponse, Media } from "./types"
import { getCookie } from "@/shared/lib/cookie"

export const apiUploadMedia = (patientId: number, file: File, category?: string) => {
	const formData = new FormData()
	formData.append("file", file)
	formData.append("patient_id", patientId.toString())
	if (category) formData.append("category", category)
	return apiInstance.post<APIResponse<Media>>(
		`/api/v1/media/upload`,
		formData,
		{ headers: { "Content-Type": "multipart/form-data" } },
	)
}

export const apiGetMedia = (patientId: number) =>
	apiInstance.get<APIResponse<Media[]>>(`/api/v1/media/patient/${patientId}`)

export const apiGetMediaDownloadUrl = (mediaId: number) =>
	apiInstance.get<APIResponse<{ url: string }>>(`/api/v1/media/${mediaId}/download`)

export const getMediaThumbnailUrl = (mediaId: number) => {
	const token = getCookie("token")
	return `${API_URL}/api/v1/media/${mediaId}/thumbnail${token ? `?token=${token}` : ''}`
}

export const apiDeleteMedia = (mediaId: number) =>
	apiInstance.delete<APIResponse<void>>(`/api/v1/media/${mediaId}`)


