<script lang="ts">
	import '@/app/styles/globals.css';
	import { Header } from '@/widgets/header';
	import { Footer } from '@/widgets/footer';

	let { children } = $props();
</script>

<div class="flex min-h-svh flex-col">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
