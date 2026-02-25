import { apiInstance } from "./base"
import type { APIResponse, Comment, CreateCommentRequest } from "./types"

export const apiCreateComment = (data: CreateCommentRequest) =>
	apiInstance.post<APIResponse<Comment>>("/api/v1/comments", data)

export const apiGetComments = (patientId: number) =>
	apiInstance.get<APIResponse<Comment[]>>(`/api/v1/patients/${patientId}/comments`)

export const apiMarkCommentRead = (commentId: number) =>
	apiInstance.post<APIResponse<void>>(`/api/v1/comments/${commentId}/read`, {})
