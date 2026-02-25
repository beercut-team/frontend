import { goto } from "$app/navigation"
import { apiRegister } from "@/shared/api"
import { authStore } from "@/entities/user"

export async function performRegister(fields: {
	name: string
	email: string
	password: string
	role?: string
	first_name?: string
	last_name?: string
	middle_name?: string
	phone?: string
	district_id?: number
	specialization?: string
	license_number?: string
}) {
	const { data } = await apiRegister(fields as any)
	authStore.setAuth(data)
	await goto("/dashboard")
}
