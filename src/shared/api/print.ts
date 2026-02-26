import { API_URL } from "./base"
import { getCookie } from "@/shared/lib/cookie"

export const downloadRoutingSheet = (patientId: number) => {
	const token = getCookie("token")
	window.open(`${API_URL}/api/v1/print/patient/${patientId}/routing-sheet?token=${token}`, "_blank")
}

export const downloadChecklistReport = (patientId: number) => {
	const token = getCookie("token")
	window.open(`${API_URL}/api/v1/print/patient/${patientId}/checklist-report?token=${token}`, "_blank")
}
