import { apiInstance } from "./base"
import type { APIResponse, Notification } from "./types"

export const apiGetNotifications = (params?: { page?: number; limit?: number; unread_only?: boolean }) =>
	apiInstance.get<APIResponse<Notification[]>>("/api/v1/notifications", { params })

export const apiGetUnreadCount = () =>
	apiInstance.get<APIResponse<{ count: number }>>("/api/v1/notifications/unread-count")

export const apiMarkNotificationRead = (id: number) =>
	apiInstance.post<APIResponse<void>>(`/api/v1/notifications/${id}/read`, {})

export const apiMarkAllNotificationsRead = () =>
	apiInstance.post<APIResponse<void>>("/api/v1/notifications/read-all", {})
