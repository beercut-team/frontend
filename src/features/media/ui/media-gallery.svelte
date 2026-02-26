<script lang="ts">
	import type { Media } from '@/shared/api';
	import { getMediaThumbnailUrl, apiGetMediaDownloadUrl, apiDeleteMedia } from '@/shared/api';
	import { Button } from '@/shared/ui/button';
	import { Card } from '@/shared/ui/card';
	import * as Dialog from '@/shared/ui/dialog';

	let {
		media,
		canDelete = false,
		ondelete,
	}: {
		media: Media[];
		canDelete?: boolean;
		ondelete?: () => void;
	} = $props();

	let deleting = $state<number | null>(null);
	let previewImage = $state<Media | null>(null);
	let previewUrl = $state<string>('');

	async function handleDelete(mediaId: number) {
		deleting = mediaId;
		try {
			await apiDeleteMedia(mediaId);
			ondelete?.();
		} catch { /* ignore */ } finally {
			deleting = null;
		}
	}

	async function handleDownload(mediaId: number, fileName: string) {
		try {
			// Get download URL with authentication
			const { data } = await apiGetMediaDownloadUrl(mediaId);
			const url = data.data.url;

			// Fetch the file as blob with authentication
			const response = await fetch(url, {
				headers: {
					'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
				}
			});

			if (!response.ok) throw new Error('Download failed');

			// Create blob and download
			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = blobUrl;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Clean up blob URL
			setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
		} catch (error) {
			console.error('Download error:', error);
			alert('Ошибка скачивания файла');
		}
	}

	async function handlePreview(file: Media) {
		if (!isImage(file.content_type)) return;

		try {
			const { data } = await apiGetMediaDownloadUrl(file.id);
			const url = data.data.url;

			// Fetch image with authentication
			const response = await fetch(url, {
				headers: {
					'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
				}
			});

			if (!response.ok) throw new Error('Preview failed');

			const blob = await response.blob();
			previewUrl = URL.createObjectURL(blob);
			previewImage = file;
		} catch (error) {
			console.error('Preview error:', error);
		}
	}

	function closePreview() {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		previewImage = null;
		previewUrl = '';
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
				<button
					class="aspect-square bg-muted w-full {isImage(file.content_type) ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'}"
					onclick={() => handlePreview(file)}
					disabled={!isImage(file.content_type)}
				>
					{#if isImage(file.content_type)}
						<img
							src={getMediaThumbnailUrl(file.id)}
							alt={file.original_name}
							class="h-full w-full object-cover"
						/>
					{:else}
						<div class="flex h-full items-center justify-center text-muted-foreground">
							<span class="text-3xl">📄</span>
						</div>
					{/if}
				</button>
				<div class="flex flex-col gap-1 p-2">
					<span class="truncate text-xs font-medium">{file.original_name}</span>
					<span class="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} КБ</span>
					<div class="flex gap-1">
						<Button
							variant="ghost"
							size="sm"
							class="h-auto p-0 text-xs text-primary"
							onclick={() => handleDownload(file.id, file.original_name)}
						>
							Скачать
						</Button>
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

	<!-- Image Preview Dialog -->
	<Dialog.Root open={previewImage !== null} onOpenChange={(open) => { if (!open) closePreview(); }}>
		<Dialog.Content class="max-w-4xl">
			<Dialog.Header>
				<Dialog.Title>{previewImage?.original_name}</Dialog.Title>
			</Dialog.Header>
			{#if previewUrl}
				<div class="flex items-center justify-center bg-muted rounded-lg overflow-hidden">
					<img
						src={previewUrl}
						alt={previewImage?.original_name}
						class="max-h-[70vh] w-auto object-contain"
					/>
				</div>
			{/if}
			<Dialog.Footer>
				<Button variant="outline" onclick={closePreview}>Закрыть</Button>
				{#if previewImage}
					<Button onclick={() => previewImage && handleDownload(previewImage.id, previewImage.original_name)}>
						Скачать
					</Button>
				{/if}
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
