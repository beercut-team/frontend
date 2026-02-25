<script lang="ts">
	import type { Notification } from '@/shared/api';

	let { notification, onmark }: { notification: Notification; onmark?: (id: number) => void } = $props();
</script>

<button
	class="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted {notification.is_read ? 'opacity-60' : ''}"
	onclick={() => onmark?.(notification.id)}
>
	<div class="mt-1 h-2 w-2 shrink-0 rounded-full {notification.is_read ? 'bg-transparent' : 'bg-primary'}"></div>
	<div class="flex min-w-0 flex-1 flex-col gap-0.5">
		<span class="text-sm font-medium">{notification.title}</span>
		<span class="text-xs text-muted-foreground line-clamp-2">{notification.message}</span>
		<span class="text-xs text-muted-foreground">
			{new Date(notification.created_at).toLocaleString('ru-RU')}
		</span>
	</div>
</button>
