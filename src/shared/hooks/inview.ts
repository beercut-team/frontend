export function inview(node: HTMLElement, callback: () => void) {
	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				callback();
				observer.unobserve(node);
			}
		},
		{ threshold: 0.15 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		},
	};
}
