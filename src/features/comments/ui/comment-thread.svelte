<script lang="ts">
	import type { Comment } from '@/entities/comment';
	import { apiMarkAllCommentsRead } from '@/entities/comment';
	import { Badge } from '@/shared/ui/badge';
	import { Button } from '@/shared/ui/button';

	let {
		comments,
		patientId,
		onrefresh
	}: {
		comments: Comment[];
		patientId: number;
		onrefresh: () => void;
	} = $props();

	let isMarkingAll = $state(false);
	const unreadCount = $derived(comments.filter(c => !c.is_read).length);

	async function markAllAsRead() {
		isMarkingAll = true;
		try {
			await apiMarkAllCommentsRead(patientId);
			onrefresh();
		} catch (e) {
			console.error('Failed to mark all as read:', e);
		} finally {
			isMarkingAll = false;
		}
	}
</script>

{#if comments.length === 0}
	<p class="text-sm text-muted-foreground">Нет комментариев</p>
{:else}
	{#if unreadCount > 0}
		<div class="mb-3 flex justify-between items-center">
			<span class="text-sm text-muted-foreground">
				{unreadCount} непрочитанных
			</span>
			<Button
				size="sm"
				variant="outline"
				onclick={markAllAsRead}
				disabled={isMarkingAll}
			>
				{isMarkingAll ? 'Отмечаем...' : 'Отметить все'}
			</Button>
		</div>
	{/if}
	<div class="flex flex-col gap-3">
		{#each comments as comment}
			<div class="rounded-lg border p-3 {comment.is_urgent ? 'border-destructive/50 bg-destructive/5' : ''} {!comment.is_read ? 'border-l-4 border-l-primary' : ''}">
				<div class="mb-1 flex items-center gap-2">
					<span class="text-sm font-medium">
						{comment.author ? `${comment.author.first_name ?? ''} ${comment.author.last_name ?? comment.author.name}`.trim() : 'Неизвестно'}
					</span>
					{#if comment.is_urgent}
						<Badge variant="destructive" class="text-xs">Срочно</Badge>
					{/if}
					<span class="text-xs text-muted-foreground">
						{new Date(comment.created_at).toLocaleString('ru-RU')}
					</span>
				</div>
				<p class="text-sm">{comment.body}</p>
			</div>
		{/each}
	</div>
{/if}
