import { goto } from "$app/navigation"
import { apiPatientLogin } from "@/shared/api"
import { authStore } from "@/entities/user"

export async function performPatientLogin(accessCode: string) {
	const { data } = await apiPatientLogin({ access_code: accessCode })
	console.log("🔐 Patient login response:", data)
	console.log("🔐 User from response:", data.user)
	console.log("🔐 Role from response:", data.user?.role)

	authStore.setAuth(data)

	const redirect = authStore.redirectAfterLogin
	authStore.redirectAfterLogin = null
	await goto(redirect ?? "/dashboard")
}
