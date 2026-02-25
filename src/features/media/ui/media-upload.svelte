<script lang="ts">
	import { apiUploadMedia } from '@/shared/api';
	import { Button } from '@/shared/ui/button';

	let {
		patientId,
		onuploaded,
	}: {
		patientId: number;
		onuploaded: () => void;
	} = $props();

	let fileInput: HTMLInputElement;
	let isDragging = $state(false);
	let isUploading = $state(false);
	let error = $state('');

	async function uploadFile(file: File) {
		isUploading = true;
		error = '';
		try {
			await apiUploadMedia(patientId, file);
			onuploaded();
		} catch (e: any) {
			error = e.response?.data?.detail ?? 'Ошибка загрузки файла';
		} finally {
			isUploading = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) uploadFile(file);
	}

	function handleFileSelect(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) uploadFile(file);
	}
</script>

<div
	class="rounded-lg border-2 border-dashed p-8 text-center transition-colors {isDragging
		? 'border-primary bg-primary/5'
		: 'border-muted-foreground/25'}"
	ondragover={(e) => { e.preventDefault(); isDragging = true; }}
	ondragleave={() => (isDragging = false)}
	ondrop={handleDrop}
	role="button"
	tabindex="0"
>
	{#if isUploading}
		<p class="text-sm text-muted-foreground">Загрузка...</p>
	{:else}
		<p class="mb-2 text-sm text-muted-foreground">
			Перетащите файл сюда или
		</p>
		<Button variant="outline" size="sm" onclick={() => fileInput.click()}>
			Выберите файл
		</Button>
		<input bind:this={fileInput} type="file" class="hidden" onchange={handleFileSelect} />
	{/if}
	{#if error}
		<p class="mt-2 text-sm text-destructive">{error}</p>
	{/if}
</div>
