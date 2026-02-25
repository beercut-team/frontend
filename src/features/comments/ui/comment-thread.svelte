<script lang="ts">
	import type { Comment } from '@/shared/api';
	import { Badge } from '@/shared/ui/badge';

	let { comments }: { comments: Comment[] } = $props();
</script>

{#if comments.length === 0}
	<p class="text-sm text-muted-foreground">Нет комментариев</p>
{:else}
	<div class="flex flex-col gap-3">
		{#each comments as comment}
			<div class="rounded-lg border p-3 {comment.is_urgent ? 'border-destructive/50 bg-destructive/5' : ''}">
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
				<p class="text-sm">{comment.content}</p>
			</div>
		{/each}
	</div>
{/if}
