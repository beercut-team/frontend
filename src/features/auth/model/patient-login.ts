import { goto } from "$app/navigation"
import { apiPatientLogin } from "@/shared/api"
import { authStore } from "@/entities/user"

export async function performPatientLogin(accessCode: string) {
	const { data } = await apiPatientLogin({ access_code: accessCode })
	console.log("🔐 Patient login response:", data)
	console.log("🔐 User from response:", data.user || data.data?.user)
	console.log("🔐 Role from response:", data.user?.role || data.data?.user?.role)

	// API may wrap response in { success, data }
	const authData = data.data ?? data
	console.log("🔐 Auth data after unwrap:", authData)
	console.log("🔐 Final user:", authData.user)
	console.log("🔐 Final role:", authData.user?.role)

	authStore.setAuth(authData)

	const redirect = authStore.redirectAfterLogin
	authStore.redirectAfterLogin = null
	await goto(redirect ?? "/dashboard")
}
