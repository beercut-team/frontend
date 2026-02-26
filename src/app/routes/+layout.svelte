<script lang="ts">
	import '@/app/styles/globals.css';
	import { Header } from '@/widgets/header';
	import { Footer } from '@/widgets/footer';
	import { authStore } from '@/entities/user';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(async () => {
		authStore.init();
	});
</script>

<svelte:head>
	<title>Oculus-Feldsher — Офтальмологическая платформа</title>
	<meta name="description" content="Медицинская платформа для офтальмологии — Oculus-Feldsher" />
	<meta name="theme-color" content="#ffffff" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<div class="flex min-h-svh flex-col">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
