import {
	apiGetNotifications,
	apiGetUnreadCount,
	apiMarkNotificationRead,
	apiMarkAllNotificationsRead,
} from "@/shared/api"
import type { Notification } from "@/shared/api"

class NotificationStore {
	notifications = $state<Notification[]>([])
	unreadCount = $state(0)
	isLoading = $state(false)
	error = $state<string | null>(null)
	private pollInterval: ReturnType<typeof setInterval> | null = null

	async fetchNotifications(params?: { page?: number; limit?: number; unread_only?: boolean }) {
		this.isLoading = true
		this.error = null
		try {
			const { data } = await apiGetNotifications(params)
			this.notifications = data.data
		} catch (e: any) {
			this.error = e.response?.data?.detail ?? "Ошибка загрузки уведомлений"
		} finally {
			this.isLoading = false
		}
	}

	async fetchUnreadCount() {
		try {
			const { data } = await apiGetUnreadCount()
			this.unreadCount = data.data.count
		} catch {
			// silent
		}
	}

	async markRead(id: number) {
		await apiMarkNotificationRead(id)
		this.notifications = this.notifications.map((n) =>
			n.id === id ? { ...n, is_read: true } : n,
		)
		this.unreadCount = Math.max(0, this.unreadCount - 1)
	}

	async markAllRead() {
		await apiMarkAllNotificationsRead()
		this.notifications = this.notifications.map((n) => ({ ...n, is_read: true }))
		this.unreadCount = 0
	}

	startPolling(intervalMs = 30_000) {
		this.stopPolling()
		this.fetchUnreadCount()
		this.pollInterval = setInterval(() => this.fetchUnreadCount(), intervalMs)
	}

	stopPolling() {
		if (this.pollInterval) {
			clearInterval(this.pollInterval)
			this.pollInterval = null
		}
	}
}

export const notificationStore = new NotificationStore()
