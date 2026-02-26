import { apiInstance } from "./base"
import type { APIResponse, Comment, CreateCommentRequest } from "./types"

export const apiCreateComment = (data: CreateCommentRequest) => {
	console.log('📤 API request:', {
		url: '/api/v1/comments',
		data: data,
		types: {
			patient_id: typeof data.patient_id,
			body: typeof data.body,
			is_urgent: typeof data.is_urgent
		}
	});

	return apiInstance.post<APIResponse<Comment>>("/api/v1/comments", data)
		.then(response => {
			console.log('✅ API response:', response.data);
			return response;
		})
		.catch(error => {
			console.error('❌ API error:', error.response?.data);
			throw error;
		});
}

export const apiGetComments = (patientId: number) =>
	apiInstance.get<APIResponse<Comment[]>>(`/api/v1/comments/patient/${patientId}`)

export const apiMarkCommentRead = (commentId: number) =>
	apiInstance.post<APIResponse<void>>(`/api/v1/comments/${commentId}/read`, {})

export const apiMarkAllCommentsRead = (patientId: number) =>
	apiInstance.post<APIResponse<void>>(`/api/v1/comments/patient/${patientId}/read`, {})
