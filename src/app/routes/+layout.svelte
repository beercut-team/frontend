<script lang="ts">
	import '@/app/styles/globals.css';
	import { Header } from '@/widgets/header';
	import { Footer } from '@/widgets/footer';

	let { children } = $props();
</script>

<svelte:head>
	<title>Beercut — PEAK IT 2026</title>
	<meta name="description" content="Команда Beercut на конкурсе PEAK IT 2026" />
</svelte:head>

<div class="flex min-h-svh flex-col">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
