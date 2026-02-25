<script lang="ts">
	import { authStore } from '@/entities/user';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { children } = $props();

	$effect(() => {
		if (!authStore.isLoading && !authStore.isAuthenticated) {
			authStore.redirectAfterLogin = $page.url.pathname;
			goto('/login');
		}
	});
</script>

{#if authStore.isLoading}
	<div class="flex min-h-[calc(100vh-8rem)] items-center justify-center">
		<p class="text-muted-foreground">Загрузка...</p>
	</div>
{:else if authStore.isAuthenticated}
	{@render children()}
{/if}
