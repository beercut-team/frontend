/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

// Workbox will inject the manifest here
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches
cleanupOutdatedCaches();

// API requests - network first with fallback
registerRoute(
	({ url }) => url.pathname.startsWith('/api/'),
	new NetworkFirst({
		cacheName: 'api-cache',
		networkTimeoutSeconds: 10,
	})
);

// Static assets - cache first
registerRoute(
	({ request }) =>
		request.destination === 'style' ||
		request.destination === 'script' ||
		request.destination === 'image',
	new CacheFirst({
		cacheName: 'static-assets',
	})
);

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});
