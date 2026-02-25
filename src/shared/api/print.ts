import { API_URL } from "./base"
import { getCookie } from "@/shared/lib/cookie"

export const downloadRoutingSheet = (patientId: number) => {
	const token = getCookie("token")
	window.open(`${API_URL}/api/v1/patients/${patientId}/print/routing-sheet?token=${token}`, "_blank")
}

export const downloadChecklistReport = (patientId: number) => {
	const token = getCookie("token")
	window.open(`${API_URL}/api/v1/patients/${patientId}/print/checklist-report?token=${token}`, "_blank")
}
