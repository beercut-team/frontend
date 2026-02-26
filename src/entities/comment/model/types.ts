import type { User } from "@/shared/api/types"

export interface Comment {
	id: number
	patient_id: number
	author_id: number
	author?: User
	parent_id?: number
	body: string
	is_urgent: boolean
	is_read: boolean
	created_at: string
	updated_at: string
}

export interface CreateCommentRequest {
	patient_id: number
	parent_id?: number
	body: string
	is_urgent?: boolean
}
