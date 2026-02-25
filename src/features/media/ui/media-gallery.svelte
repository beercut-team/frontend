<script lang="ts">
	import type { Media } from '@/shared/api';
	import { getMediaThumbnailUrl, getMediaDownloadUrl, apiDeleteMedia } from '@/shared/api';
	import { Button } from '@/shared/ui/button';
	import { Card } from '@/shared/ui/card';

	let {
		patientId,
		media,
		canDelete = false,
		ondelete,
	}: {
		patientId: number;
		media: Media[];
		canDelete?: boolean;
		ondelete?: () => void;
	} = $props();

	let deleting = $state<number | null>(null);

	async function handleDelete(mediaId: number) {
		deleting = mediaId;
		try {
			await apiDeleteMedia(patientId, mediaId);
			ondelete?.();
		} catch { /* ignore */ } finally {
			deleting = null;
		}
	}

	function isImage(contentType: string) {
		return contentType.startsWith('image/');
	}
</script>

{#if media.length === 0}
	<p class="text-sm text-muted-foreground">Нет загруженных файлов</p>
{:else}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		{#each media as file}
			<Card class="overflow-hidden">
				<div class="aspect-square bg-muted">
					{#if isImage(file.content_type)}
						<img
							src={getMediaThumbnailUrl(patientId, file.id)}
							alt={file.original_filename}
							class="h-full w-full object-cover"
						/>
					{:else}
						<div class="flex h-full items-center justify-center text-muted-foreground">
							<span class="text-3xl">📄</span>
						</div>
					{/if}
				</div>
				<div class="flex flex-col gap-1 p-2">
					<span class="truncate text-xs font-medium">{file.original_filename}</span>
					<span class="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} КБ</span>
					<div class="flex gap-1">
						<a
							href={getMediaDownloadUrl(patientId, file.id)}
							target="_blank"
							rel="noopener"
							class="text-xs text-primary hover:underline"
						>
							Скачать
						</a>
						{#if canDelete}
							<Button
								variant="ghost"
								size="sm"
								class="h-auto p-0 text-xs text-destructive"
								onclick={() => handleDelete(file.id)}
								disabled={deleting === file.id}
							>
								Удалить
							</Button>
						{/if}
					</div>
				</div>
			</Card>
		{/each}
	</div>
{/if}
