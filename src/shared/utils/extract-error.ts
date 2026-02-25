import type { AxiosError } from "axios"

/**
 * Extracts full human-readable error from an Axios error response.
 * Handles: string detail, array of errors, object with message, nested validation errors.
 */
export function extractApiError(e: unknown, fallback = "Произошла ошибка"): string {
	const err = e as AxiosError<any>
	const data = err?.response?.data

	if (!data) {
		return err?.message ?? fallback
	}

	// FastAPI-style: { detail: "string" }
	if (typeof data.detail === "string") {
		return data.detail
	}

	// FastAPI validation: { detail: [ { loc: [...], msg: "...", type: "..." }, ... ] }
	if (Array.isArray(data.detail)) {
		return data.detail
			.map((item: any) => {
				if (typeof item === "string") return item
				const field = Array.isArray(item.loc)
					? item.loc.filter((l: any) => l !== "body").join(".")
					: ""
				const msg = item.msg ?? JSON.stringify(item)
				return field ? `${field}: ${msg}` : msg
			})
			.join("\n")
	}

	// { message: "..." }
	if (typeof data.message === "string") {
		return data.message
	}

	// { error: "..." }
	if (typeof data.error === "string") {
		return data.error
	}

	// Last resort: stringify entire body
	if (typeof data === "string") {
		return data
	}

	try {
		return JSON.stringify(data, null, 2)
	} catch {
		return fallback
	}
}
