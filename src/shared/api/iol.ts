import { apiInstance } from "./base"
import type { APIResponse, IOLCalculationRequest, IOLCalculation } from "./types"

export const apiCalculateIOL = (data: IOLCalculationRequest) =>
	apiInstance.post<APIResponse<IOLCalculation>>("/api/v1/iol/calculate", data)

export const apiGetIOLHistory = (patientId: number) =>
	apiInstance.get<APIResponse<IOLCalculation[]>>(`/api/v1/iol/patient/${patientId}/history`)
