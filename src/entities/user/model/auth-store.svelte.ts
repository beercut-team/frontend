import { goto } from "$app/navigation"
import { apiGetMe, apiLogout } from "@/shared/api"
import type { AuthResponse, User } from "@/shared/api"
import { UserRole } from "@/shared/api/types"
import { getCookie, setCookie } from "@/shared/lib/cookie"

class AuthStore {
	user = $state<User | null>(null)
	isAuthenticated = $derived(this.user !== null)
	isLoading = $state(true)
	redirectAfterLogin = $state<string | null>(null)

	isAdmin = $derived(this.user?.role === UserRole.ADMIN)
	isSurgeon = $derived(this.user?.role === UserRole.SURGEON)
	isDistrictDoctor = $derived(this.user?.role === UserRole.DISTRICT_DOCTOR)
	isPatient = $derived(this.user?.role === UserRole.PATIENT)

	async init() {
		const token = getCookie("token")
		if (!token) {
			this.isLoading = false
			return
		}

		try {
			const { data } = await apiGetMe()
			// API may wrap response in { success, data }
			this.user = (data as any).data ?? data
		} catch {
			setCookie("token", "", -1)
			setCookie("refresh_token", "", -1)
			this.user = null
		} finally {
			this.isLoading = false
		}
	}

	setAuth(response: AuthResponse) {
		setCookie("token", response.access_token, 7)
		setCookie("refresh_token", response.refresh_token, 30)
		this.user = response.user
	}

	async logout() {
		try {
			await apiLogout()
		} catch {
			// ignore logout errors
		} finally {
			setCookie("token", "", -1)
			setCookie("refresh_token", "", -1)
			this.user = null
			goto("/")
		}
	}
}

export const authStore = new AuthStore()
