import { goto } from "$app/navigation"
import { apiLogin } from "@/shared/api"
import { authStore } from "@/entities/user"

export async function performLogin(email: string, password: string) {
	const { data } = await apiLogin({ email, password })
	authStore.setAuth(data)

	const redirect = authStore.redirectAfterLogin
	authStore.redirectAfterLogin = null
	await goto(redirect ?? "/")
}
