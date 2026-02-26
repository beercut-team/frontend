import { apiInstance } from "./base"
import type {
	AuthResponse,
	LoginRequest,
	PatientLoginRequest,
	MessageResponse,
	RegisterRequest,
	User,
} from "./types"

export const apiLogin = (data: LoginRequest) =>
	apiInstance.post<AuthResponse>("/api/v1/auth/login", data)

export const apiPatientLogin = (data: PatientLoginRequest) =>
	apiInstance.post<AuthResponse>("/api/v1/auth/patient-login", data)

export const apiRegister = (data: RegisterRequest) =>
	apiInstance.post<AuthResponse>("/api/v1/auth/register", data)

export const apiRefresh = (refresh_token: string) =>
	apiInstance.post<AuthResponse>("/api/v1/auth/refresh", { refresh_token })

export const apiGetMe = () => apiInstance.get<User>("/api/v1/auth/me")

export const apiLogout = () =>
	apiInstance.post<MessageResponse>("/api/v1/auth/logout", {})

