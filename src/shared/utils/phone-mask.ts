/**
 * Formats a phone number string into +7 (XXX) XXX-XX-XX mask.
 * Only keeps digits, forces +7 prefix.
 * Returns empty string if no meaningful digits.
 */
export function applyPhoneMask(raw: string): string {
	// Strip everything except digits
	let digits = raw.replace(/\D/g, "")

	// If empty or just "7", return empty to allow clearing
	if (digits.length === 0 || digits === "7") {
		return ""
	}

	// Normalize: if starts with 8 or 7, treat as Russian number
	if (digits.startsWith("8")) {
		digits = "7" + digits.slice(1)
	}
	if (!digits.startsWith("7")) {
		digits = "7" + digits
	}

	// Limit to 11 digits (7 + 10)
	digits = digits.slice(0, 11)

	// Build masked output
	let result = "+7"
	if (digits.length > 1) {
		result += " (" + digits.slice(1, 4)
	}
	if (digits.length >= 4) {
		result += ") " + digits.slice(4, 7)
	}
	if (digits.length >= 7) {
		result += "-" + digits.slice(7, 9)
	}
	if (digits.length >= 9) {
		result += "-" + digits.slice(9, 11)
	}

	return result
}

/**
 * Strips mask, returns raw digits like "79991234567"
 */
export function stripPhoneMask(masked: string): string {
	return masked.replace(/\D/g, "")
}
