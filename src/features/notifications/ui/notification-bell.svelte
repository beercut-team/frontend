<script lang="ts">
	import { notificationStore } from '@/entities/notification';
	import { Button } from '@/shared/ui/button';
	import { onMount, onDestroy } from 'svelte';

	onMount(() => {
		notificationStore.startPolling();
	});

	onDestroy(() => {
		notificationStore.stopPolling();
	});
</script>

<a href="/notifications" class="relative">
	<Button variant="ghost" size="sm" class="relative">
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
			<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
		</svg>
		{#if notificationStore.unreadCount > 0}
			<span class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
				{notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount}
			</span>
		{/if}
	</Button>
</a>
