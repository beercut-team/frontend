// ==================== Enums ====================

export enum UserRole {
	ADMIN = "ADMIN",
	SURGEON = "SURGEON",
	DISTRICT_DOCTOR = "DISTRICT_DOCTOR",
	PATIENT = "PATIENT",
}

export enum PatientStatus {
	NEW = "NEW",
	PREPARATION = "PREPARATION",
	REVIEW_NEEDED = "REVIEW_NEEDED",
	APPROVED = "APPROVED",
	SURGERY_SCHEDULED = "SURGERY_SCHEDULED",
	COMPLETED = "COMPLETED",
	REJECTED = "REJECTED",
}

export enum ChecklistStatus {
	PENDING = "PENDING",
	IN_PROGRESS = "IN_PROGRESS",
	COMPLETED = "COMPLETED",
	REJECTED = "REJECTED",
	EXPIRED = "EXPIRED",
}

export enum SurgeryStatus {
	SCHEDULED = "SCHEDULED",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",
}

export enum OperationType {
	PHACOEMULSIFICATION = "PHACOEMULSIFICATION",
	ANTIGLAUCOMA = "ANTIGLAUCOMA",
	VITRECTOMY = "VITRECTOMY",
}

export enum Eye {
	OD = "OD",
	OS = "OS",
	OU = "OU",
}

export enum NotificationType {
	CHECKLIST_UPDATED = "CHECKLIST_UPDATED",
	CHECKLIST_REVIEWED = "CHECKLIST_REVIEWED",
	STATUS_CHANGED = "STATUS_CHANGED",
	SURGERY_SCHEDULED = "SURGERY_SCHEDULED",
	COMMENT_ADDED = "COMMENT_ADDED",
	URGENT_COMMENT = "URGENT_COMMENT",
}

// ==================== Pagination ====================

export interface Meta {
	page: number
	limit: number
	total: number
	total_pages: number
}

export interface APIResponse<T> {
	success: boolean
	data: T
	meta?: Meta
}

// ==================== Auth ====================

export interface User {
	id: number
	email: string
	name: string
	role: UserRole
	first_name: string
	last_name: string
	middle_name?: string
	phone?: string
	district_id?: number
	specialization?: string
	license_number?: string
	is_active: boolean
}

export interface AuthResponse {
	access_token: string
	refresh_token: string
	user: User
}

export interface LoginRequest {
	email: string
	password: string
}

export interface PatientLoginRequest {
	access_code: string
}

export interface RegisterRequest {
	email: string
	password: string
	name: string
	role?: UserRole
	first_name?: string
	last_name?: string
	middle_name?: string
	phone?: string
}

export interface MessageResponse {
	message: string
}

// ==================== District ====================

export interface District {
	id: number
	name: string
	region: string
	code?: string
	timezone?: string
	created_at: string
	updated_at: string
}

export interface CreateDistrictRequest {
	name: string
	region: string
	description?: string
}

export interface UpdateDistrictRequest {
	name?: string
	region?: string
	description?: string
}

// ==================== Patient ====================

export interface Patient {
	id: number
	access_code?: string
	first_name: string
	last_name: string
	middle_name?: string
	date_of_birth: string
	phone?: string
	email?: string
	address?: string
	snils?: string
	passport_series?: string
	passport_number?: string
	policy_number?: string
	diagnosis?: string
	operation_type: OperationType
	eye: Eye
	status: PatientStatus
	doctor_id: number
	surgeon_id?: number
	district_id: number
	district?: District
	notes?: string
	surgery_date?: string
	created_at: string
	updated_at: string
}

export interface CreatePatientRequest {
	first_name: string
	last_name: string
	middle_name?: string
	date_of_birth?: string
	phone?: string
	email?: string
	address?: string
	snils?: string
	passport_series?: string
	passport_number?: string
	policy_number?: string
	diagnosis?: string
	operation_type: OperationType
	eye: Eye
	district_id: number
	notes?: string
}

export interface UpdatePatientRequest {
	first_name?: string
	last_name?: string
	middle_name?: string
	date_of_birth?: string
	phone?: string
	email?: string
	address?: string
	snils?: string
	passport_series?: string
	passport_number?: string
	policy_number?: string
	diagnosis?: string
	operation_type?: OperationType
	eye?: Eye
	notes?: string
	surgeon_id?: number
}

export interface PatientStatusRequest {
	status: PatientStatus
	comment?: string
}

export interface PatientPublicResponse {
	access_code: string
	first_name: string
	last_name: string
	status: PatientStatus
	surgery_date?: string
	status_history: PatientStatusHistory[]
}

export interface PatientStatusHistory {
	status: PatientStatus
	changed_at: string
	comment?: string
	changed_by?: string
}

export interface PatientDashboard {
	total_patients: number
	by_status: Partial<Record<PatientStatus, number>>
	recent_patients: Patient[]
}

// ==================== Checklist ====================

export interface ChecklistItem {
	id: number
	patient_id: number
	template_id: number
	name: string
	description?: string
	category: string
	is_required: boolean
	status: ChecklistStatus
	result?: string
	notes?: string
	completed_at?: string
	completed_by?: number
	reviewed_by?: number
	review_note?: string
	expires_at?: string
	created_at: string
	updated_at: string
}

export interface UpdateChecklistItemRequest {
	result?: string
	notes?: string
	status?: ChecklistStatus
}

export interface ReviewChecklistItemRequest {
	status: ChecklistStatus.COMPLETED | ChecklistStatus.REJECTED
	review_note?: string
}

export interface ChecklistProgress {
	total: number
	completed: number
	reviewed: number
	rejected: number
	pending: number
	percentage: number
}

// ==================== Media ====================

export interface Media {
	id: number
	patient_id: number
	uploaded_by: number
	file_name: string
	original_name: string
	content_type: string
	size: number
	storage_path: string
	thumbnail_path?: string
	category: string
	created_at: string
}

// ==================== IOL Calculator ====================

export interface IOLCalculationRequest {
	patient_id: number
	eye: Eye
	axial_length: number
	keratometry1: number
	keratometry2: number
	acd?: number
	target_refraction?: number
	formula: string
	a_constant?: number
}

export interface IOLCalculation {
	id: number
	patient_id: number
	eye: Eye
	axial_length: number
	keratometry1: number
	keratometry2: number
	acd?: number
	target_refraction: number
	formula: string
	iol_power: number
	predicted_refraction: number
	a_constant?: number
	calculated_by?: number
	warnings?: string
	created_at: string
}

// ==================== Surgery ====================

export interface Surgery {
	id: number
	patient_id: number
	patient?: Patient
	surgeon_id: number
	surgeon?: User
	scheduled_date: string
	operation_type: string
	eye: string
	status: SurgeryStatus
	notes?: string
	created_at: string
	updated_at: string
}

export interface CreateSurgeryRequest {
	patient_id: number
	scheduled_date: string
	notes?: string
}

export interface UpdateSurgeryRequest {
	operation_type?: OperationType
	eye?: Eye
	scheduled_date?: string
	status?: SurgeryStatus
	iol_power?: number
	notes?: string
	complications?: string
	outcome?: string
}

// ==================== Comment ====================

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

// ==================== Notification ====================

export interface Notification {
	id: number
	user_id: number
	type: NotificationType
	title: string
	body: string
	is_read: boolean
	entity_type?: string
	entity_id?: number
	created_at: string
}
