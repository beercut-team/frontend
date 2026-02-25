import { goto } from "$app/navigation"
import { apiRegister } from "@/shared/api"
import { authStore } from "@/entities/user"

export async function performRegister(
	name: string,
	email: string,
	password: string,
) {
	const { data } = await apiRegister({ name, email, password })
	authStore.setAuth(data)
	await goto("/")
}
