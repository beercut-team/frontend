import { writable } from 'svelte/store';
import { browser } from '$app/environment';

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

	const getInitialSettings = (): AccessibilitySettings => {
		if (!browser) return defaultSettings;
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
	};

	const store = writable<AccessibilitySettings>(getInitialSettings());

	function saveToStorage(settings: AccessibilitySettings) {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
		}
	}

	function applySettings(settings: AccessibilitySettings) {
		if (!browser) return;

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

	// Apply initial settings
	if (browser) {
		applySettings(getInitialSettings());
	}

	return {
		subscribe: store.subscribe,
		setFontSize: (fontSize: FontSize) => {
			store.update((s) => {
				const newSettings = { ...s, fontSize };
				saveToStorage(newSettings);
				applySettings(newSettings);
				return newSettings;
			});
		},
		setColorScheme: (colorScheme: ColorScheme) => {
			store.update((s) => {
				const newSettings = { ...s, colorScheme };
				saveToStorage(newSettings);
				applySettings(newSettings);
				return newSettings;
			});
		},
		toggle: () => {
			store.update((s) => {
				const newSettings = { ...s, isEnabled: !s.isEnabled };
				saveToStorage(newSettings);
				applySettings(newSettings);
				return newSettings;
			});
		},
		reset: () => {
			const newSettings = defaultSettings;
			store.set(newSettings);
			saveToStorage(newSettings);
			applySettings(newSettings);
		},
	};
}

export const accessibilityStore = createAccessibilityStore();
