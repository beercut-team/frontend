import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
	const getInitialTheme = (): Theme => {
		if (!browser) return 'light';

		const stored = localStorage.getItem('theme') as Theme | null;
		if (stored) return stored;

		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};

	const store = writable<Theme>(getInitialTheme());

	const applyTheme = (theme: Theme) => {
		if (!browser) return;

		const html = document.documentElement;
		if (theme === 'dark') {
			html.classList.add('dark');
		} else {
			html.classList.remove('dark');
		}
		localStorage.setItem('theme', theme);
	};

	if (browser) {
		applyTheme(getInitialTheme());
	}

	return {
		subscribe: store.subscribe,
		toggle: () => {
			const current = get(store);
			const newTheme: Theme = current === 'light' ? 'dark' : 'light';
			applyTheme(newTheme);
			store.set(newTheme);
		},
		set: (theme: Theme) => {
			applyTheme(theme);
			store.set(theme);
		}
	};
}

export const themeStore = createThemeStore();
