<script lang="ts">
	import { notificationStore, NotificationItem } from '@/entities/notification';
	import { Button } from '@/shared/ui/button';
	import { Skeleton } from '@/shared/ui/skeleton';
	import { onMount } from 'svelte';

	onMount(() => {
		notificationStore.fetchNotifications();
	});
</script>

<svelte:head>
	<title>Уведомления — Oculus-Feldsher</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-6 py-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Уведомления</h1>
		{#if notificationStore.unreadCount > 0}
			<Button variant="outline" size="sm" onclick={() => notificationStore.markAllRead()}>
				Прочитать все
			</Button>
		{/if}
	</div>

	{#if notificationStore.isLoading}
		<div class="flex flex-col gap-2">
			{#each Array(5) as _}
				<Skeleton class="h-16 rounded-lg" />
			{/each}
		</div>
	{:else if notificationStore.notifications.length === 0}
		<p class="text-muted-foreground">Нет уведомлений</p>
	{:else}
		<div class="flex flex-col gap-1 rounded-lg border">
			{#each notificationStore.notifications as notification}
				<NotificationItem
					{notification}
					onmark={(id) => notificationStore.markRead(id)}
				/>
			{/each}
		</div>
	{/if}
</div>
