import { writable } from 'svelte/store';

export type FontSize = 'small' | 'medium' | 'large';
export type ColorScheme = 'default' | 'black-white' | 'white-black' | 'blue-white';

interface AccessibilitySettings {
	fontSize: FontSize;
	colorScheme: ColorScheme;
	isEnabled: boolean;
}

const STORAGE_KEY = 'accessibility-settings';

function createAccessibilityStore() {
	const defaultSettings: AccessibilitySettings = {
		fontSize: 'medium',
		colorScheme: 'default',
		isEnabled: false,
	};

	// Load from localStorage if available
	const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
	const initial = stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;

	const { subscribe, set, update } = writable<AccessibilitySettings>(initial);

	function saveToStorage(settings: AccessibilitySettings) {
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
		}
	}

	function applySettings(settings: AccessibilitySettings) {
		if (typeof document === 'undefined') return;

		const html = document.documentElement;

		// Remove all accessibility classes
		html.classList.remove('a11y-enabled', 'a11y-font-small', 'a11y-font-medium', 'a11y-font-large');
		html.classList.remove('a11y-scheme-default', 'a11y-scheme-black-white', 'a11y-scheme-white-black', 'a11y-scheme-blue-white');

		if (settings.isEnabled) {
			html.classList.add('a11y-enabled');
			html.classList.add(`a11y-font-${settings.fontSize}`);
			html.classList.add(`a11y-scheme-${settings.colorScheme}`);
		}
	}

	return {
		subscribe,
		setFontSize: (fontSize: FontSize) => {
			update((s) => {
				const newSettings = { ...s, fontSize };
				saveToStorage(newSettings);
				applySettings(newSettings);
				return newSettings;
			});
		},
		setColorScheme: (colorScheme: ColorScheme) => {
			update((s) => {
				const newSettings = { ...s, colorScheme };
				saveToStorage(newSettings);
				applySettings(newSettings);
				return newSettings;
			});
		},
		toggle: () => {
			update((s) => {
				const newSettings = { ...s, isEnabled: !s.isEnabled };
				saveToStorage(newSettings);
				applySettings(newSettings);
				return newSettings;
			});
		},
		reset: () => {
			const newSettings = defaultSettings;
			set(newSettings);
			saveToStorage(newSettings);
			applySettings(newSettings);
		},
		init: () => {
			update((s) => {
				applySettings(s);
				return s;
			});
		},
	};
}

export const accessibilityStore = createAccessibilityStore();
