<script lang="ts">
	import { apiCreateComment } from '@/shared/api';
	import { Button } from '@/shared/ui/button';
	import { Textarea } from '@/shared/ui/textarea';
	import { Checkbox } from '@/shared/ui/checkbox';
	import { Label } from '@/shared/ui/label';

	let {
		patientId,
		oncommented,
	}: {
		patientId: number;
		oncommented: () => void;
	} = $props();

	let body = $state('');
	let isUrgent = $state(false);
	let isSubmitting = $state(false);
	let error = $state('');

	async function submit() {
		if (!body.trim()) return;
		isSubmitting = true;
		error = '';
		try {
			await apiCreateComment({ patient_id: patientId, body, is_urgent: isUrgent });
			body = '';
			isUrgent = false;
			oncommented();
		} catch (e: any) {
			error = e.response?.data?.detail ?? 'Ошибка отправки';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="flex flex-col gap-3">
	{#if error}
		<p class="text-sm text-destructive">{error}</p>
	{/if}
	<Textarea bind:value={body} placeholder="Написать комментарий..." rows={3} />
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<Checkbox bind:checked={isUrgent} id="urgent" />
			<Label for="urgent" class="text-sm">Срочное</Label>
		</div>
		<Button size="sm" onclick={submit} disabled={!body.trim() || isSubmitting}>
			{isSubmitting ? 'Отправка...' : 'Отправить'}
		</Button>
	</div>
</div>
