<script lang="ts">
	import '@/app/styles/globals.css';
	import { Header } from '@/widgets/header';
	import { Footer } from '@/widgets/footer';
	import { authStore } from '@/entities/user';
	import { onMount } from 'svelte';
	// PWA temporarily disabled
	// import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();

	onMount(async () => {
		authStore.init();

		// PWA temporarily disabled
		// if (pwaInfo) {
		// 	const { registerSW } = await import('virtual:pwa-register');
		// 	registerSW({
		// 		immediate: true,
		// 		onRegistered(registration) {
		// 			console.log('PWA registered:', registration);
		// 		},
		// 		onRegisterError(error) {
		// 			console.error('PWA registration error:', error);
		// 		}
		// 	});
		// }
	});
</script>

<svelte:head>
	<title>Oculus-Feldsher — Офтальмологическая платформа</title>
	<meta name="description" content="Медицинская платформа для офтальмологии — Oculus-Feldsher" />
	<meta name="theme-color" content="#ffffff" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="apple-mobile-web-app-title" content="Oculus" />
</svelte:head>

<div class="flex min-h-svh flex-col">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
