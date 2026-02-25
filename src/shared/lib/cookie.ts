/**
 * Получает значение cookie по его имени.
 * @param name — имя cookie (без «;» и лишних пробелов)
 * @returns строку-значение cookie или null, если не найдено
 */
export const getCookie = (name: string): string | null => {
	// document.cookie имеет формат "key1=value1; key2=value2; ..."
	const matches = document.cookie.match(
		// Регулярка ищет совпадение: имя=значение
		new RegExp(
			// \\b — граница слова, чтобы не найти похожие имена; ([^;]*) — захват до ;
			String.raw`(?:^|; )${name.replace(/([.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1")}=([^;]*)`,
		),
	)
	// Если совпадение найдено, вернуть группу с первым захватом; иначе null
	return matches ? decodeURIComponent(matches[1]) : null
}

/**
 * Устанавливает или обновляет cookie с заданными параметрами.
 * @param name — имя cookie
 * @param value — значение cookie
 * @param days — срок жизни в днях (целое число). Если не указан или равен 0, cookie будет сессийной.
 */
export const setCookie = (name: string, value: string, days?: number): void => {
	let expires = ""
	if (typeof days === "number" && days > 0) {
		const date = new Date()
		// Устанавливаем время в будущем на days * 24 часа
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = "; expires=" + date.toUTCString() // :contentReference[oaicite:0]{index=0}
	}
	// Синтаксис: <имя>=<значение>; expires=<UTC-время>; path=/;
	document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/;`
}
